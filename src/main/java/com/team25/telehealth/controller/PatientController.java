package com.team25.telehealth.controller;

import com.team25.telehealth.dto.PatientDTO;
import com.team25.telehealth.dto.request.AuthenticationRequest;
import com.team25.telehealth.dto.request.ConsentRequest;
import com.team25.telehealth.dto.request.EmailRequest;
import com.team25.telehealth.service.ConsentService;
import com.team25.telehealth.service.PatientService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;

@RestController
@RequestMapping("api/v1/patient")
@AllArgsConstructor
public class PatientController {

    private final PatientService patientService;
    private final ConsentService consentService;

    @GetMapping("/")
    public ResponseEntity<?> getPatient(@Valid @RequestBody EmailRequest email, Principal principal) {
        return ResponseEntity.status(HttpStatus.OK).body(patientService.getPatientByEmail(email.getEmail()));
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("files") MultipartFile[] files, Principal principal) {
        return patientService.uploadFile(files, principal);
    }

    @GetMapping("/fetch/{fileName}")
    public ResponseEntity<?> fetchFile(Principal principal, @PathVariable String fileName) {
        return patientService.fetchFile(principal, fileName);
    }

    @PostMapping("/generateotp")
    public ResponseEntity<?> generateOTP(Principal principal) {
        return ResponseEntity.ok(patientService.generateOtp(principal));
    }

    @PutMapping("/changePassword")
    public ResponseEntity<?> changePassword(Principal principal, @RequestBody AuthenticationRequest req) {
        return patientService.changePassword(principal, req);
    }

    @GetMapping("/files")
    public ResponseEntity<?> fetchAllFileNames(Principal principal) {
        return patientService.fetchAllFileNames(principal);
    }

    @GetMapping("/consents-requested")
    public ResponseEntity<?> fetchAllConsentRequests(Principal principal) {
        return consentService.fetchAllConsentRequests(principal);
    }

    @PutMapping("/give-consent")
    public ResponseEntity<?> giveConsent(Principal principal, @Valid @RequestBody ConsentRequest request) {
        return consentService.giveConsent(principal, request);
    }

    @PutMapping("/update")
    public ResponseEntity<?> updatePatient(Principal principal, @RequestBody PatientDTO patientDTO){
        return patientService.updatePatient(principal, patientDTO);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> update(Principal principal){
        return patientService.deletePatient(principal);
    }
}
