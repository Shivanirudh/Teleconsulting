package com.team25.telehealth.controller;

import com.team25.telehealth.dto.ConsentDTO;
import com.team25.telehealth.dto.DoctorDTO;
import com.team25.telehealth.dto.PatientDTO;
import com.team25.telehealth.dto.ScheduleDTO;
import com.team25.telehealth.dto.request.AuthenticationRequest;
import com.team25.telehealth.dto.request.EmailRequest;
import com.team25.telehealth.entity.Doctor;
import com.team25.telehealth.service.ConsentService;
import com.team25.telehealth.service.DoctorService;
import com.team25.telehealth.service.ScheduleService;
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
    private final ScheduleService scheduleService;

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

    @GetMapping("/consent")
    public ResponseEntity<?> checkDoctorConsents(Principal principal) {
        return consentService.checkDoctorConsents(principal);
    }

    @GetMapping("/consent/{consentId}/patient/{patientId}")
    public ResponseEntity<?> fetchDocument(Principal principal, @PathVariable String consentId, @PathVariable String patientId) {
        return consentService.fetchDocument(principal, consentId, patientId);
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateDoctor(Principal principal, @RequestBody DoctorDTO doctorDTO){
        return doctorService.updateDoctor(principal, doctorDTO);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteDoctor(Principal principal) {
        return doctorService.deleteDoctor(principal);
    }
    
    @PostMapping("/schedule")
    public ResponseEntity<?> uploadSchedule(Principal principal, @Valid @RequestBody ScheduleDTO scheduleDTO) {
        return scheduleService.uploadSchedule(principal, scheduleDTO);
    }

    @GetMapping("/schedule")
    public ResponseEntity<?> fetchSchedule(Principal principal) {
        return scheduleService.fetchSchedule(principal);
    }
}
