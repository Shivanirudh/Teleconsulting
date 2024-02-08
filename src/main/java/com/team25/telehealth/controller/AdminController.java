package com.team25.telehealth.controller;

import com.team25.telehealth.entity.Admin;
import com.team25.telehealth.service.AdminService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/admin")
@AllArgsConstructor
public class AdminController {
    private final AdminService adminService;

    @GetMapping("/")
    public ResponseEntity<?> getAdmin(@RequestBody String email) {
        return ResponseEntity.status(HttpStatus.OK).body(adminService.getAdminByEmail(email));
    }

    @PostMapping("/")
    public ResponseEntity<?> addAdmin(@RequestBody Admin admin) {
        return ResponseEntity.status(HttpStatus.OK).body(adminService.addAdmin(admin));
    }
}
