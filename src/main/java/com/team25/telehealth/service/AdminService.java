package com.team25.telehealth.service;

import com.team25.telehealth.entity.Admin;
import com.team25.telehealth.helpers.AdminIdGenerator;
import com.team25.telehealth.helpers.OtpHelper;
import com.team25.telehealth.mappers.AdminMapper;
import com.team25.telehealth.mappers.AdminMapperImpl;
import com.team25.telehealth.model.EmailRequest;
import com.team25.telehealth.repo.AdminRepo;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Principal;

import static com.team25.telehealth.model.Role.ADMIN;

@Service
@AllArgsConstructor
public class AdminService {
    private final AdminRepo adminRepo;
    private final DoctorService doctorService;
    private final PasswordEncoder passwordEncoder;
    private final AdminIdGenerator adminIdGenerator;
    private final MailService mailService;
    private final OtpHelper otpHelper;
    private final AdminMapper adminMapper = new AdminMapperImpl();

    @Transactional
    public Admin addAdmin(Admin admin) {
        admin.setRole(ADMIN);
        admin.setAdminId(adminIdGenerator.generateNextId());
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        return adminRepo.save(admin);
    }

    public Admin getAdminByEmail(String email) {
        if (email == null || email.isEmpty()) return null;
//        mailService.sendEmail("prashantjain0501@gmail.com", "Testing email", "Just a simple testing mail");
        return adminRepo.findByEmail(email).orElse(null);
    }

    public String generateOtp(Principal principal) {
        String adminEmail = principal.getName();
        Admin admin = getAdminByEmail(adminEmail);
        if(admin == null) return "User not Found";
        admin.setOtp(otpHelper.generateOtp());
        admin.setOtpExpiry(otpHelper.generateExpirationTime());
        adminRepo.save(admin);

        return "Otp generated Successfully";
    }
}
