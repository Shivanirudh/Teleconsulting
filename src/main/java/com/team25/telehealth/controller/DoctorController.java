package com.team25.telehealth.controller;

import com.team25.telehealth.dto.ConsentDTO;
import com.team25.telehealth.dto.request.AuthenticationRequest;
import com.team25.telehealth.dto.request.EmailRequest;
import com.team25.telehealth.entity.Doctor;
import com.team25.telehealth.service.ConsentService;
import com.team25.telehealth.service.DoctorService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("api/v1/doctor")
@AllArgsConstructor
public class DoctorController {
    private final DoctorService doctorService;
    private final ConsentService consentService;

    @GetMapping("/")
    public ResponseEntity<?> getDoctor(@Valid @RequestBody EmailRequest email, Principal principal) {
        return ResponseEntity.status(HttpStatus.OK).body(doctorService.getDoctorByEmail(email.getEmail()));
    }

//    @PostMapping("/")
//    public ResponseEntity<?> addDoctor(@RequestBody Doctor doctor, Principal principal) {
//        return ResponseEntity.status(HttpStatus.OK).body(doctorService.addDoctor(doctor));
//    }

    @PostMapping("/generateotp")
    public ResponseEntity<?> generateOTP(Principal principal) {
        return ResponseEntity.ok(doctorService.generateOtp(principal));
    }

    @PutMapping("/changePassword")
    public ResponseEntity<?> changePassword(Principal principal, @RequestBody AuthenticationRequest req) {
        return doctorService.changePassword(principal, req);
    }

    @PostMapping("/consent")
    public ResponseEntity<?> getConsent(Principal principal,@RequestBody ConsentDTO consentDTO) {
        return consentService.getConsent(principal, consentDTO);
    }
}
