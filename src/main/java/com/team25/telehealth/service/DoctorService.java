package com.team25.telehealth.service;

import com.team25.telehealth.dto.DoctorDTO;
import com.team25.telehealth.entity.Doctor;
import com.team25.telehealth.mappers.AdminMapperImpl;
import com.team25.telehealth.mappers.DoctorMapper;
import com.team25.telehealth.mappers.DoctorMapperImpl;
import com.team25.telehealth.repo.DoctorRepo;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class DoctorService {
    private final DoctorRepo doctorRepo;
    private final PasswordEncoder passwordEncoder;
    private final DoctorMapper doctorMapper = new DoctorMapperImpl();

    public DoctorDTO addDoctor(Doctor doctor) {
        doctor.setPassword(passwordEncoder.encode(doctor.getPassword()));
        return doctorMapper.toDTO(doctorRepo.save(doctor));
    }

    public Doctor getDoctorByEmail(String email) {
        if (email == null || email.isEmpty()) return null;
        return doctorRepo.findByEmail(email).orElse(null);
    }
}
