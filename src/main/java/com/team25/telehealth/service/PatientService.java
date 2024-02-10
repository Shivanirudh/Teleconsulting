package com.team25.telehealth.service;

import com.team25.telehealth.dto.PatientDTO;
import com.team25.telehealth.entity.Patient;
import com.team25.telehealth.helpers.PatientIdGenerator;
import com.team25.telehealth.mappers.PatientMapper;
import com.team25.telehealth.mappers.PatientMapperImpl;
import com.team25.telehealth.model.Role;
import com.team25.telehealth.repo.PatientRepo;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import static com.team25.telehealth.model.Role.PATIENT;

@Service
@AllArgsConstructor
public class PatientService {
    private final PatientRepo patientRepo;
    private final PasswordEncoder passwordEncoder;
    private final PatientIdGenerator patientIdGenerator;
    private final PatientMapper patientMapper = new PatientMapperImpl();

    @Transactional
    public Patient addPatient(Patient patient) {
        patient.setRole(PATIENT);
        patient.setPatientId(patientIdGenerator.generateNextId());
        patient.setPassword(passwordEncoder.encode(patient.getPassword()));
        return patientRepo.save(patient);
    }

    public Patient getPatientByEmail(String email) {
        if (email == null || email.isEmpty()) return null;
        return patientRepo.findByEmail(email).orElse(null);
    }
}
