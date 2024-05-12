package com.team25.telehealth.auth;

import com.team25.telehealth.config.JwtService;
import com.team25.telehealth.dto.PatientDTO;
import com.team25.telehealth.dto.request.AuthenticationRequest;
import com.team25.telehealth.dto.request.EmailRequest;
import com.team25.telehealth.dto.request.PatientRegistrationDTO;
import com.team25.telehealth.dto.response.AuthenticationResponse;
import com.team25.telehealth.entity.Patient;
import com.team25.telehealth.entity.Token;
import com.team25.telehealth.entity.Validate;
import com.team25.telehealth.helpers.OtpHelper;
import com.team25.telehealth.helpers.exceptions.ResourceNotFoundException;
import com.team25.telehealth.mappers.PatientMapper;
import com.team25.telehealth.model.*;
import com.team25.telehealth.repo.*;
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
import org.springframework.security.crypto.password.PasswordEncoder;
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
    private final PatientMapper patientMapper;
    private final PasswordEncoder passwordEncoder;
    private final ValidateRepo validateRepo;

//    public AuthenticationResponse registerPatient(Patient req) {
//        var patient = patientService.addPatient(req);
//        var jwtToken = jwtService.generateToken(new User(req));
//        saveUserToken(patient.getPatientId(), jwtToken);
//        return AuthenticationResponse.builder()
//                .token(jwtToken)
//                .build();
//    }

    @Transactional
    public ResponseEntity<?> registerPatient(PatientRegistrationDTO req) {
        Validate validate = validateRepo.findById(req.getPatientDTO().getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "Email", req.getPatientDTO().getEmail()));

        if(otpHelper.otpCheck(req.getOtp(), validate.getOtp(), validate.getOtpExpiry())) {
            var patient = patientService.addPatient(patientMapper.toEntity(req.getPatientDTO()));
            if(patient == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Couldn't create the user.");
            }
            return ResponseEntity.ok("User created Successfully");
        } else {
            return ResponseEntity.badRequest().body("OTP is wrong or expired");
        }
    }

    public ResponseEntity<?> authenticatePatient(AuthenticationRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );
        var patient = patientService.getPatientByEmail(req.getEmail());
        if(!otpHelper.otpEqual(req.getOtp(), patient.getOtp()) || otpHelper.isOtpExpired(patient.getOtpExpiry())) {
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
                .userId(patient.getPatientId())
                .email(patient.getEmail())
                .firstName(patient.getFirstName())
                .lastName(patient.getLastName())
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    public ResponseEntity<?> authenticateDoctor(AuthenticationRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );
        var doctor = doctorService.getDoctorByEmail(req.getEmail());
        if(!otpHelper.otpEqual(req.getOtp(), doctor.getOtp()) || otpHelper.isOtpExpired(doctor.getOtpExpiry())) {
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
                .userId(doctor.getDoctorId())
                .email(doctor.getEmail())
                .firstName(doctor.getFirstName())
                .lastName(doctor.getLastName())
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    public ResponseEntity<?> authenticateAdmin(AuthenticationRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );

        var admin = adminService.getAdminByEmail(req.getEmail());
        if(!otpHelper.otpEqual(req.getOtp(), admin.getOtp()) || otpHelper.isOtpExpired(admin.getOtpExpiry())) {
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
                .userId(admin.getAdminId())
                .email(admin.getEmail())
                .firstName(admin.getFirstName())
                .lastName(admin.getLastName())
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

    public ResponseEntity<?> generatePatientOtp(EmailRequest req) {
        var patient = patientService.getPatientByEmail(req.getEmail());
        String otp = otpHelper.generateOtp();
        patient.setOtp(passwordEncoder.encode(otp));
        patient.setOtpExpiry(otpHelper.generateExpirationTime());
        patientRepo.save(patient);
        mailService.sendEmail(patient.getEmail(),
                "OTP For TeleHealth Website",
                otp + " This is the OTP generated for your account. Do not Share it with anyone. It will only be valid for 10 minutes.");
        return ResponseEntity.ok("Otp Generated Successfully");
    }

    public ResponseEntity<?> generateDoctorOtp(EmailRequest req) {
        var doctor = doctorService.getDoctorByEmail(req.getEmail());
        String otp = otpHelper.generateOtp();
        doctor.setOtp(passwordEncoder.encode(otp));
        doctor.setOtpExpiry(otpHelper.generateExpirationTime());
        doctorRepo.save(doctor);
        mailService.sendEmail(doctor.getEmail(),
                "OTP For TeleHealth Website",
                otp + " This is the OTP generated for your account. Do not Share it with anyone It will be valid for only 10 minutes.");
        return ResponseEntity.ok("Otp Generated Successfully");
    }

    public ResponseEntity<?> generateAdminOtp(EmailRequest req) {
        var admin = adminService.getAdminByEmail(req.getEmail());
        String otp = otpHelper.generateOtp();
        admin.setOtp(passwordEncoder.encode(otp));
        admin.setOtpExpiry(otpHelper.generateExpirationTime());
        adminRepo.save(admin);
        mailService.sendEmail(admin.getEmail(),
                "OTP For TeleHealth Website",
                otp + " This is the OTP generated for your account. Do not Share it with anyone It will be valid for only 10 minutes.");
        return ResponseEntity.ok("Otp Generated Successfully");
    }

    @Transactional
    public ResponseEntity<?> forgotPasswordAdmin(AuthenticationRequest req) {
        var admin = adminService.getAdminByEmail(req.getEmail());
        if(!otpHelper.otpCheck(req.getOtp(), admin.getOtp(), admin.getOtpExpiry()))
            return ResponseEntity.badRequest().body("OTP is incorrect or expired");
        if(!req.getPassword().equals(req.getRetypePassword()))
            return ResponseEntity.badRequest().body("Both passwords should be same");
        admin.setPassword(passwordEncoder.encode(req.getPassword()));
        adminRepo.save(admin);
        return ResponseEntity.ok("Password updated successfully");
    }

    @Transactional
    public ResponseEntity<?> forgotPasswordDoctor(AuthenticationRequest req) {
        var doctor = doctorService.getDoctorByEmail(req.getEmail());
        if(!otpHelper.otpCheck(req.getOtp(), doctor.getOtp(), doctor.getOtpExpiry()))
            return ResponseEntity.badRequest().body("OTP is incorrect or expired");
        if(!req.getPassword().equals(req.getRetypePassword()))
            return ResponseEntity.badRequest().body("Both passwords should be same");
        doctor.setPassword(passwordEncoder.encode(req.getPassword()));
        doctorRepo.save(doctor);
        return ResponseEntity.ok("Password updated successfully");
    }

    @Transactional
    public ResponseEntity<?> forgotPasswordPatient(AuthenticationRequest req) {
        var patient = patientService.getPatientByEmail(req.getEmail());
        if(!otpHelper.otpCheck(req.getOtp(), patient.getOtp(), patient.getOtpExpiry()))
            return ResponseEntity.badRequest().body("OTP is incorrect or expired");
        if(!req.getPassword().equals(req.getRetypePassword()))
            return ResponseEntity.badRequest().body("Both passwords should be same");
        patient.setPassword(passwordEncoder.encode(req.getPassword()));
        patientRepo.save(patient);
        return ResponseEntity.ok("Password updated successfully");
    }

    public ResponseEntity<?> registerPatientOTP(EmailRequest req) {
        Validate validate;
        String otp = null;
        try {
            var patient = patientService.getPatientByEmail(req.getEmail());
            return ResponseEntity.badRequest().body("Patient with given Email id is already present");
        } catch(Exception e) {
             validate = validateRepo.findById(req.getEmail()).orElse(null);
             otp = otpHelper.generateOtp();
             if(validate != null) {
                 validate.setOtp(passwordEncoder.encode(otp));
                 validate.setOtpExpiry(otpHelper.generateExpirationTime(15));
             } else {
                 validate = Validate.builder()
                         .email(req.getEmail())
                         .otp(passwordEncoder.encode(otp))
                         .otpExpiry(otpHelper.generateExpirationTime(15))
                         .build();
             }
            validateRepo.save(validate);
        }
        mailService.sendEmail(validate.getEmail(),
                "OTP For TeleHealth Website",
                otp + " This is the OTP generated for your account. Do not Share it with anyone. It will only be valid for 15 minutes.");
        return ResponseEntity.ok("Otp Generated Successfully");
    }
}
