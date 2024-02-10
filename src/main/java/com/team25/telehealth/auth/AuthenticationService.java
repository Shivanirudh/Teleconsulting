package com.team25.telehealth.auth;

import com.team25.telehealth.config.JwtService;
import com.team25.telehealth.entity.Patient;
import com.team25.telehealth.entity.Token;
import com.team25.telehealth.model.AuthenticationRequest;
import com.team25.telehealth.model.AuthenticationResponse;
import com.team25.telehealth.model.TokenType;
import com.team25.telehealth.model.User;
import com.team25.telehealth.repo.TokenRepo;
import com.team25.telehealth.service.AdminService;
import com.team25.telehealth.service.DoctorService;
import com.team25.telehealth.service.PatientService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthenticationService {
    private final PatientService patientService;
    private final DoctorService doctorService;
    private final AdminService adminService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final TokenRepo tokenRepo;

    public AuthenticationResponse registerPatient(Patient req) {
        var patient = patientService.addPatient(req);
        var jwtToken = jwtService.generateToken(new User(req));
        saveUserToken(patient.getPatientId(), jwtToken);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse authenticatePatient(AuthenticationRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );

        var user = new User(patientService.getPatientByEmail(req.getEmail()));
        var jwtToken = jwtService.generateToken(user);
        revokeAllUserTokens(user.getId());
        saveUserToken(user.getId(), jwtToken);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse authenticateDoctor(AuthenticationRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );

        var user = new User(doctorService.getDoctorByEmail(req.getEmail()));
        var jwtToken = jwtService.generateToken(user);
        revokeAllUserTokens(user.getId());
        saveUserToken(user.getId(), jwtToken);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse authenticateAdmin(AuthenticationRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );

        var user = new User(adminService.getAdminByEmail(req.getEmail()));
        var jwtToken = jwtService.generateToken(user);
        revokeAllUserTokens(user.getId());
        saveUserToken(user.getId(), jwtToken);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    private void saveUserToken(String user, String jwtToken) {
        var token = Token.builder()
                .userId(user)
                .token(jwtToken)
                .expired(false)
                .tokenType(TokenType.BEARER)
                .revoked(false)
                .build();
        tokenRepo.save(token);
    }

    private void revokeAllUserTokens(String id) {
        var validUserTokens = tokenRepo.findByUserId(id);
        if(validUserTokens == null) return;
        validUserTokens.forEach(t -> {
            t.setExpired(true);
            t.setRevoked(true);
        });
        tokenRepo.saveAll(validUserTokens);
    }
}
