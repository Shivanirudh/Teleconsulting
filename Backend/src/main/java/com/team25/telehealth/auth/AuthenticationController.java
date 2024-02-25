package com.team25.telehealth.auth;

import com.team25.telehealth.entity.Patient;
import com.team25.telehealth.model.AuthenticationRequest;
import com.team25.telehealth.model.AuthenticationResponse;
import com.team25.telehealth.model.EmailRequest;
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

    @PostMapping("/patient/register")
    public ResponseEntity<?> registerPatient(@RequestBody Patient req) {
        return ResponseEntity.status(HttpStatus.OK).body(service.registerPatient(req));
    }

    @PostMapping("/generate/patient/otp")
    public ResponseEntity<?> generatePatientOtp(@RequestBody EmailRequest req) {
        return ResponseEntity.status(HttpStatus.OK).body(service.generatePatientOtp(req));
    }

    @PostMapping("/generate/doctor/otp")
    public ResponseEntity<?> generateDoctorOtp(@RequestBody EmailRequest req) {
        return ResponseEntity.status(HttpStatus.OK).body(service.generateDoctorOtp(req));
    }

    @PostMapping("/generate/admin/otp")
    public ResponseEntity<?> generateAdminOtp(@RequestBody EmailRequest req) {
        return ResponseEntity.status(HttpStatus.OK).body(service.generateAdminOtp(req));
    }

    @PostMapping("/patient/authenticate")
    public ResponseEntity<?> authenticatePatient(@RequestBody AuthenticationRequest req) {
        return service.authenticatePatient(req);
    }
    @PostMapping("/doctor/authenticate")
    public ResponseEntity<?> authenticateDoctor(@RequestBody AuthenticationRequest req) {
        return service.authenticateDoctor(req);
    }
    @PostMapping("/admin/authenticate")
    public ResponseEntity<?> authenticateAdmin(@RequestBody AuthenticationRequest req) {
        return service.authenticateAdmin(req);
    }
}
