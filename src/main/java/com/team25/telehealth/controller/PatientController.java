package com.team25.telehealth.controller;

import com.team25.telehealth.service.PatientService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("api/v1/patient")
@AllArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @GetMapping("/")
    public ResponseEntity<?> getPatient(@RequestBody String email, Principal principal) {
        return ResponseEntity.status(HttpStatus.OK).body(patientService.getPatientByEmail(email));
    }
}
