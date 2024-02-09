package com.team25.telehealth.auth;

import com.team25.telehealth.entity.Patient;
import com.team25.telehealth.model.AuthenticationRequest;
import com.team25.telehealth.model.AuthenticationResponse;
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
    public ResponseEntity<AuthenticationResponse> registerPatient(@RequestBody Patient req) {
        return ResponseEntity.status(HttpStatus.OK).body(service.registerPatient(req));
    }
    @PostMapping("/patient/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticatePatient(@RequestBody AuthenticationRequest req) {
        return ResponseEntity.status(HttpStatus.OK).body(service.authenticatePatient(req));
    }
    @PostMapping("/doctor/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticateDoctor(@RequestBody AuthenticationRequest req) {
        return ResponseEntity.status(HttpStatus.OK).body(service.authenticateDoctor(req));
    }
    @PostMapping("/admin/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticateAdmin(@RequestBody AuthenticationRequest req) {
        return ResponseEntity.status(HttpStatus.OK).body(service.authenticateAdmin(req));
    }
}
