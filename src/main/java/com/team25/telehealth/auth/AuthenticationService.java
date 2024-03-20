package com.team25.telehealth.auth;

import com.team25.telehealth.config.JwtService;
import com.team25.telehealth.dto.request.AuthenticationRequest;
import com.team25.telehealth.dto.request.EmailRequest;
import com.team25.telehealth.dto.response.AuthenticationResponse;
import com.team25.telehealth.entity.Patient;
import com.team25.telehealth.entity.Token;
import com.team25.telehealth.helpers.OtpHelper;
import com.team25.telehealth.model.*;
import com.team25.telehealth.repo.AdminRepo;
import com.team25.telehealth.repo.DoctorRepo;
import com.team25.telehealth.repo.PatientRepo;
import com.team25.telehealth.repo.TokenRepo;
import com.team25.telehealth.service.AdminService;
import com.team25.telehealth.service.DoctorService;
import com.team25.telehealth.service.MailService;
import com.team25.telehealth.service.PatientService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthenticationService {
    private final PatientService patientService;
    private final PatientRepo patientRepo;
    private final DoctorService doctorService;
    private final DoctorRepo doctorRepo;
    private final AdminService adminService;
    private final AdminRepo adminRepo;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final TokenRepo tokenRepo;
    private final OtpHelper otpHelper;
    private final MailService mailService;

//    public AuthenticationResponse registerPatient(Patient req) {
//        var patient = patientService.addPatient(req);
//        var jwtToken = jwtService.generateToken(new User(req));
//        saveUserToken(patient.getPatientId(), jwtToken);
//        return AuthenticationResponse.builder()
//                .token(jwtToken)
//                .build();
//    }

    @Transactional
    public ResponseEntity<?> registerPatient(Patient req) {
        var patient = patientService.addPatient(req);
        if(patient == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Couldn't create the user.");
        }
        return ResponseEntity.ok("User created Successfully");
    }

    public ResponseEntity<?> authenticatePatient(AuthenticationRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );
        var patient = patientService.getPatientByEmail(req.getEmail());
        if(!req.getOtp().equals(patient.getOtp()) || otpHelper.isOtpExpired(patient.getOtpExpiry())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Wrong Otp or Expired");
        }
        if(!patient.getActive())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Patient "+ patient.getEmail() + " is blocked or not present");
        var user = new User(patient);
        var jwtToken = jwtService.generateToken(user);
        revokeAllUserTokens(user.getId());
        saveUserToken(user.getId(), jwtToken);
        AuthenticationResponse res = AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    public ResponseEntity<?> authenticateDoctor(AuthenticationRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );
        var doctor = doctorService.getDoctorByEmail(req.getEmail());
        if(!req.getOtp().equals(doctor.getOtp()) || otpHelper.isOtpExpired(doctor.getOtpExpiry())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Wrong Otp or Expired");
        }
        if(!doctor.getActive())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Doctor "+ doctor.getEmail() + " is blocked or not present");
        var user = new User(doctor);
        var jwtToken = jwtService.generateToken(user);
        revokeAllUserTokens(user.getId());
        saveUserToken(user.getId(), jwtToken);
        var res = AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    public ResponseEntity<?> authenticateAdmin(AuthenticationRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );

        var admin = adminService.getAdminByEmail(req.getEmail());
        if(!req.getOtp().equals(admin.getOtp()) || otpHelper.isOtpExpired(admin.getOtpExpiry())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Wrong Otp or Expired");
        }
        if(!admin.getActive())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Admin " + admin.getEmail() + " is blocked or not present");
        var user = new User(admin);
        var jwtToken = jwtService.generateToken(user);
        revokeAllUserTokens(user.getId());
        saveUserToken(user.getId(), jwtToken);
        var res = AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(res);
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

    public String generatePatientOtp(EmailRequest req) {
        if(req.getEmail() == null) return "Provide necessary details";
        var patient = patientService.getPatientByEmail(req.getEmail());
        if(patient == null) return "Patient not found";
        patient.setOtp(otpHelper.generateOtp());
        patient.setOtpExpiry(otpHelper.generateExpirationTime());
        patientRepo.save(patient);
        mailService.sendEmail(patient.getEmail(), "OTP For TeleHealth Website", patient.getOtp() + " This is the OTP generated for logging into your account. Do not Share it with anyone It will be valid for only 10 minutes.");
        return "Otp Generated Successfully";
    }

    public String generateDoctorOtp(EmailRequest req) {
        if(req.getEmail() == null) return "Provide necessary details";
        var doctor = doctorService.getDoctorByEmail(req.getEmail());
        if(doctor == null) return "Doctor not found";
        doctor.setOtp(otpHelper.generateOtp());
        doctor.setOtpExpiry(otpHelper.generateExpirationTime());
        doctorRepo.save(doctor);
        mailService.sendEmail(doctor.getEmail(), "OTP For TeleHealth Website", doctor.getOtp() + " This is the OTP generated for logging into your account. Do not Share it with anyone It will be valid for only 10 minutes.");
        return "Otp Generated Successfully";
    }

    public String generateAdminOtp(EmailRequest req) {
        if(req.getEmail() == null) return "Provide necessary details";
        var admin = adminService.getAdminByEmail(req.getEmail());
        if(admin == null) return "Admin not found";
        admin.setOtp(otpHelper.generateOtp());
        admin.setOtpExpiry(otpHelper.generateExpirationTime());
        adminRepo.save(admin);
        mailService.sendEmail(admin.getEmail(), "OTP For TeleHealth Website", admin.getOtp() + " This is the OTP generated for logging into your account. Do not Share it with anyone It will be valid for only 10 minutes.");
        return "Otp Generated Successfully";
    }
}
