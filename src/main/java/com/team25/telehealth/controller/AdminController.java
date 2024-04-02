package com.team25.telehealth.controller;

import com.team25.telehealth.dto.DoctorDTO;
import com.team25.telehealth.dto.HospitalDTO;
import com.team25.telehealth.dto.request.AuthenticationRequest;
import com.team25.telehealth.entity.Admin;
import com.team25.telehealth.service.AdminService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("api/v1/admin")
@AllArgsConstructor
//@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final AdminService adminService;

//    @GetMapping("/")
//    @PreAuthorize("hasAuthority('admin:read')")
//    public ResponseEntity<?> getAdmin(@RequestBody String email, Principal principal) {
//        return ResponseEntity.status(HttpStatus.OK).body(adminService.getAdminByEmail(email));
//    }

//    @PostMapping("/")
//    @PreAuthorize("hasAuthority('admin:create')")
//    public ResponseEntity<?> addAdmin(@RequestBody Admin admin, Principal principal) {
//        return ResponseEntity.status(HttpStatus.OK).body(adminService.addAdmin(admin));
//    }

    @PostMapping("/hospital")
    public ResponseEntity<?> addHospital(Principal principal, @Valid @RequestBody HospitalDTO hospitalDTO) {
        return adminService.addHospital(principal, hospitalDTO);
    }

    @PostMapping("/doctor")
    public ResponseEntity<?> addDoctor(Principal principal, @Valid @RequestBody DoctorDTO doctorDTO) {
        return adminService.addDoctor(principal, doctorDTO);
    }

    @PostMapping("/generateotp")
    public ResponseEntity<?> generateOTP(Principal principal) {
        return ResponseEntity.ok(adminService.generateOtp(principal));
    }

    @PutMapping("/changePassword")
    public ResponseEntity<?> changePassword(Principal principal, @RequestBody AuthenticationRequest req) {
        return adminService.changePassword(principal, req);
    }

    @PutMapping("/block-patient")
    public ResponseEntity<?> blockPatient(Principal principal, @RequestBody String patientId){
        return adminService.blockPatient(principal, patientId);
    }

    @PutMapping("/unblock-patient")
    public ResponseEntity<?> unblockPatient(Principal principal, @RequestBody String patientId){
        return adminService.unblockPatient(principal, patientId);
    }

    @PutMapping("/block-doctor")
    public ResponseEntity<?> blockDoctor(Principal principal, @RequestBody String doctorId){
        return adminService.blockDoctor(principal, doctorId);
    }

    @PutMapping("/unblock-doctor")
    public ResponseEntity<?> unblockDoctor(Principal principal, @RequestBody String doctorId){
        return adminService.unblockDoctor(principal, doctorId);
    }

    @PutMapping("/block-hospital")
    public ResponseEntity<?> blockHospital(Principal principal, @RequestBody String hospitalId){
        return adminService.blockHospital(principal, hospitalId);
    }

    @PutMapping("/unblock-hospital")
    public ResponseEntity<?> unblockHospital(Principal principal, @RequestBody String hospitalId){
        return adminService.unblockHospital(principal, hospitalId);
    }
  
    @GetMapping("/patients")
    public ResponseEntity<?> getPatients(Principal principal) {
        return adminService.getPatients(principal);
    }

    @GetMapping("/doctors")
    public ResponseEntity<?> getDoctors(Principal principal) {
        return adminService.getDoctors(principal);
    }

    @GetMapping("/hospitals")
    public ResponseEntity<?> getHospitals(Principal principal) {
        return adminService.getHospitals(principal);
    }
}
