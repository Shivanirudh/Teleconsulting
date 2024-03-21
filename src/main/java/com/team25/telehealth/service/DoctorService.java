package com.team25.telehealth.service;

import com.team25.telehealth.dto.request.AuthenticationRequest;
import com.team25.telehealth.entity.Doctor;
import com.team25.telehealth.entity.Patient;
import com.team25.telehealth.helpers.exceptions.ResourceNotFoundException;
import com.team25.telehealth.helpers.generators.DoctorIdGenerator;
import com.team25.telehealth.helpers.OtpHelper;
import com.team25.telehealth.mappers.DoctorMapper;
import com.team25.telehealth.mappers.DoctorMapperImpl;
import com.team25.telehealth.repo.DoctorRepo;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Principal;

import static com.team25.telehealth.model.Role.DOCTOR;

@Service
@AllArgsConstructor
public class DoctorService {
    private final DoctorRepo doctorRepo;
    private final PasswordEncoder passwordEncoder;
    private final DoctorIdGenerator doctorIdGenerator;
    private final OtpHelper otpHelper;
    private final MailService mailService;
    private final DoctorMapper doctorMapper;

    @Transactional
    public Doctor addDoctor(Doctor doctor) {
        doctor.setRole(DOCTOR);
        doctor.setDoctorId(doctorIdGenerator.generateNextId());
        doctor.setActive(true);
        doctor.setPassword(passwordEncoder.encode(doctor.getPassword()));
        return doctorRepo.save(doctor);
    }

    public Doctor getDoctorByEmail(String email) {
        if (email == null || email.isEmpty()) return null;
        return doctorRepo.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("Doctor", "email", email));
    }

    @Transactional
    public String generateOtp(Principal principal) {
        String adminEmail = principal.getName();
        Doctor doctor = getDoctorByEmail(adminEmail);
        doctor.setOtp(otpHelper.generateOtp());
        doctor.setOtpExpiry(otpHelper.generateExpirationTime());
        doctorRepo.save(doctor);
        mailService.sendEmail(doctor.getEmail(),
                "OTP For TeleHealth Website",
                doctor.getOtp() + " This is the OTP generated for your account. Do not Share it with anyone.");
        return "Otp generated Successfully";
    }

    public ResponseEntity<?> changePassword(Principal principal, AuthenticationRequest req) {
        Doctor doctor = getDoctorByEmail(principal.getName());
        if(!otpHelper.otpCheck(req.getOtp(), doctor.getOtp(), doctor.getOtpExpiry())) {
            return ResponseEntity.badRequest().body("OTP is wrong or expired");
        }
        if(!req.getPassword().equals(req.getRetypePassword())
                || !(req.getPassword().length() >= 4 && req.getPassword().length() <= 255)) {
            return ResponseEntity.badRequest()
                    .body("Passwords should be same. Password should have atleast 4 characters and atmost 255");
        }
        doctor.setPassword(passwordEncoder.encode(req.getPassword()));
        doctorRepo.save(doctor);
        return ResponseEntity.ok("Password Changed Successfully");
    }
}
