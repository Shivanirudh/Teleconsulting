package com.team25.telehealth.service;

import com.team25.telehealth.entity.Admin;
import com.team25.telehealth.helpers.exceptions.ResourceNotFoundException;
import com.team25.telehealth.helpers.generators.AdminIdGenerator;
import com.team25.telehealth.helpers.OtpHelper;
import com.team25.telehealth.mappers.AdminMapper;
import com.team25.telehealth.mappers.AdminMapperImpl;
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
        admin.setActive(true);
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        return adminRepo.save(admin);
    }

    public Admin getAdminByEmail(String email) {
        if (email == null || email.isEmpty()) return null;
        return adminRepo.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("Admin", "email", email));
    }

    @Transactional
    public String generateOtp(Principal principal) {
        String adminEmail = principal.getName();
        Admin admin = getAdminByEmail(adminEmail);
        admin.setOtp(otpHelper.generateOtp());
        admin.setOtpExpiry(otpHelper.generateExpirationTime());
        adminRepo.save(admin);
        mailService.sendEmail(admin.getEmail(),
                "OTP For TeleHealth Website",
                admin.getOtp() + " This is the OTP generated for your account. Do not Share it with anyone.");
        return "Otp generated Successfully";
    }
}
