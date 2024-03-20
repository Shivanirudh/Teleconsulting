package com.team25.telehealth.service;

import com.team25.telehealth.entity.Doctor;
import com.team25.telehealth.helpers.generators.DoctorIdGenerator;
import com.team25.telehealth.helpers.OtpHelper;
import com.team25.telehealth.mappers.DoctorMapper;
import com.team25.telehealth.mappers.DoctorMapperImpl;
import com.team25.telehealth.repo.DoctorRepo;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
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
    private final DoctorMapper doctorMapper = new DoctorMapperImpl();

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
        return doctorRepo.findByEmail(email).orElse(null);
    }

    @Transactional
    public String generateOtp(Principal principal) {
        String adminEmail = principal.getName();
        Doctor doctor = getDoctorByEmail(adminEmail);
        if(doctor == null) return "User not Found";
        doctor.setOtp(otpHelper.generateOtp());
        doctor.setOtpExpiry(otpHelper.generateExpirationTime());
        doctorRepo.save(doctor);
        mailService.sendEmail(doctor.getEmail(), "OTP For TeleHealth Website", doctor.getOtp() + " This is the OTP generated for your account. Do not Share it with anyone.");
        return "Otp generated Successfully";
    }
}
