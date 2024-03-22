package com.team25.telehealth.service;

import com.team25.telehealth.dto.DoctorDTO;
import com.team25.telehealth.dto.HospitalDTO;
import com.team25.telehealth.dto.request.AuthenticationRequest;
import com.team25.telehealth.entity.Admin;
import com.team25.telehealth.entity.Hospital;
import com.team25.telehealth.helpers.exceptions.ResourceNotFoundException;
import com.team25.telehealth.helpers.generators.AdminIdGenerator;
import com.team25.telehealth.helpers.OtpHelper;
import com.team25.telehealth.helpers.generators.HospitalIdGenerator;
import com.team25.telehealth.mappers.AdminMapper;
import com.team25.telehealth.mappers.HospitalMapper;
import com.team25.telehealth.repo.AdminRepo;
import com.team25.telehealth.repo.HospitalRepo;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Principal;

import static com.team25.telehealth.model.Role.ADMIN;

@Service
@AllArgsConstructor
public class AdminService {
    private final EntityManager entityManager;
    private final AdminRepo adminRepo;
    private final DoctorService doctorService;
    private final PasswordEncoder passwordEncoder;
    private final AdminIdGenerator adminIdGenerator;
    private final MailService mailService;
    private final OtpHelper otpHelper;
    private final AdminMapper adminMapper;
    private final HospitalMapper hospitalMapper;
    private final HospitalService hospitalService;

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

    public ResponseEntity<?> changePassword(Principal principal, AuthenticationRequest req) {
        Admin admin = getAdminByEmail(principal.getName());
        if(!otpHelper.otpCheck(req.getOtp(), admin.getOtp(), admin.getOtpExpiry())) {
            return ResponseEntity.badRequest().body("OTP is wrong or expired");
        }
        if(!req.getPassword().equals(req.getRetypePassword())
                || !(req.getPassword().length() >= 4 && req.getPassword().length() <= 255)) {
            return ResponseEntity.badRequest()
                    .body("Passwords should be same. Password should have atleast 4 characters and atmost 255");
        }
        admin.setPassword(passwordEncoder.encode(req.getPassword()));
        adminRepo.save(admin);
        return ResponseEntity.ok("Password Changed Successfully");
    }

    public ResponseEntity<?> addHospital(Principal principal, HospitalDTO hospitalDTO) {
        return hospitalService.addHospital(principal, hospitalDTO);
    }

    public ResponseEntity<?> addDoctor(Principal principal, DoctorDTO doctorDTO) {
        if(doctorDTO.getHospital().getHospitalId() == null || doctorDTO.getHospital().getHospitalId().isEmpty())
            return ResponseEntity.badRequest().body("Hospital of the doctor must be provided");
        Hospital hospital = hospitalService.findByHospitalId(doctorDTO.getHospital().getHospitalId());
        return doctorService.addDoctor(principal, doctorDTO, hospital);
    }
}
