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
}
