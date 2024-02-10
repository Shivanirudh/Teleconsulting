package com.team25.telehealth.service;

import com.team25.telehealth.dto.DoctorDTO;
import com.team25.telehealth.entity.Doctor;
import com.team25.telehealth.helpers.DoctorIdGenerator;
import com.team25.telehealth.mappers.AdminMapperImpl;
import com.team25.telehealth.mappers.DoctorMapper;
import com.team25.telehealth.mappers.DoctorMapperImpl;
import com.team25.telehealth.model.Role;
import com.team25.telehealth.repo.DoctorRepo;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import static com.team25.telehealth.model.Role.DOCTOR;

@Service
@AllArgsConstructor
public class DoctorService {
    private final DoctorRepo doctorRepo;
    private final PasswordEncoder passwordEncoder;
    private final DoctorIdGenerator doctorIdGenerator;
    private final DoctorMapper doctorMapper = new DoctorMapperImpl();

    @Transactional
    public Doctor addDoctor(Doctor doctor) {
        doctor.setRole(DOCTOR);
        doctor.setDoctorId(doctorIdGenerator.generateNextId());
        doctor.setPassword(passwordEncoder.encode(doctor.getPassword()));
        return doctorRepo.save(doctor);
    }

    public Doctor getDoctorByEmail(String email) {
        if (email == null || email.isEmpty()) return null;
        return doctorRepo.findByEmail(email).orElse(null);
    }
}
