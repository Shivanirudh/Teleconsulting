package com.team25.telehealth.auth;

import com.team25.telehealth.dto.PatientDTO;
import com.team25.telehealth.dto.request.PatientRegistrationDTO;
import com.team25.telehealth.entity.Patient;
import com.team25.telehealth.dto.request.AuthenticationRequest;
import com.team25.telehealth.dto.request.EmailRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService service;

    @PostMapping("/patient/register/otp")
    public ResponseEntity<?> registerPatientOTP(@Valid @RequestBody EmailRequest req) {
        return service.registerPatientOTP(req);
    }

    @PostMapping("/patient/register")
    public ResponseEntity<?> registerPatient(@Valid @RequestBody PatientRegistrationDTO req) {
        return service.registerPatient(req);
    }

    @PostMapping("/generate/patient/otp")
    public ResponseEntity<?> generatePatientOtp(@Valid @RequestBody EmailRequest req) {
        return ResponseEntity.status(HttpStatus.OK).body(service.generatePatientOtp(req));
    }

    @PostMapping("/generate/doctor/otp")
    public ResponseEntity<?> generateDoctorOtp(@Valid @RequestBody EmailRequest req) {
        return ResponseEntity.status(HttpStatus.OK).body(service.generateDoctorOtp(req));
    }

    @PostMapping("/generate/admin/otp")
    public ResponseEntity<?> generateAdminOtp(@Valid @RequestBody EmailRequest req) {
        return ResponseEntity.status(HttpStatus.OK).body(service.generateAdminOtp(req));
    }

    @PostMapping("/patient/authenticate")
    public ResponseEntity<?> authenticatePatient(@Valid @RequestBody AuthenticationRequest req) {
        return service.authenticatePatient(req);
    }
    @PostMapping("/doctor/authenticate")
    public ResponseEntity<?> authenticateDoctor(@Valid @RequestBody AuthenticationRequest req) {
        return service.authenticateDoctor(req);
    }
    @PostMapping("/admin/authenticate")
    public ResponseEntity<?> authenticateAdmin(@Valid @RequestBody AuthenticationRequest req) {
        return service.authenticateAdmin(req);
    }

    @PostMapping("/patient/forgotpassword")
    public ResponseEntity<?> forgotPasswordPatient(@Valid @RequestBody AuthenticationRequest req) {
        return service.forgotPasswordPatient(req);
    }

    @PostMapping("/doctor/forgotpassword")
    public ResponseEntity<?> forgotPasswordDoctor(@Valid @RequestBody AuthenticationRequest req) {
        return service.forgotPasswordDoctor(req);
    }

    @PostMapping("/admin/forgotpassword")
    public ResponseEntity<?> forgotPasswordAdmin(@Valid @RequestBody AuthenticationRequest req) {
        return service.forgotPasswordAdmin(req);
    }
}
