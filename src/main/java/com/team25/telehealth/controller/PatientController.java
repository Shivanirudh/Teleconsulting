package com.team25.telehealth.controller;

import com.team25.telehealth.service.PatientService;
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

    @GetMapping("/")
    public ResponseEntity<?> getPatient(@RequestBody String email, Principal principal) {
        return ResponseEntity.status(HttpStatus.OK).body(patientService.getPatientByEmail(email));
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("files") MultipartFile[] files, Principal principal) {
        return patientService.uploadFile(files, principal);
    }

    @GetMapping("/fetch/{fileName}")
    public ResponseEntity<?> fetchFile(Principal principal, @PathVariable String fileName) {
        return patientService.fetchFile(principal, fileName);
    }
}
