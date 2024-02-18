package com.team25.telehealth.controller;

import com.team25.telehealth.entity.Admin;
import com.team25.telehealth.service.AdminService;
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

    @GetMapping("/")
//    @PreAuthorize("hasAuthority('admin:read')")
    public ResponseEntity<?> getAdmin(@RequestBody String email, Principal principal) {
        return ResponseEntity.status(HttpStatus.OK).body(adminService.getAdminByEmail(email));
    }

    @PostMapping("/")
//    @PreAuthorize("hasAuthority('admin:create')")
    public ResponseEntity<?> addAdmin(@RequestBody Admin admin, Principal principal) {
        return ResponseEntity.status(HttpStatus.OK).body(adminService.addAdmin(admin));
    }
}
