package com.team25.telehealth.service;

import com.team25.telehealth.dto.PatientDTO;
import com.team25.telehealth.entity.Patient;
import com.team25.telehealth.mappers.PatientMapper;
import com.team25.telehealth.mappers.PatientMapperImpl;
import com.team25.telehealth.repo.PatientRepo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class PatientService {
    private final PatientRepo patientRepo;
    private final PatientMapper patientMapper = new PatientMapperImpl();

    public PatientDTO addPatient(Patient patient) {
        return patientMapper.toDTO(patientRepo.save(patient));
    }

    public Patient getPatientByEmail(String email) {
        if (email == null || email.isEmpty()) return null;
        return patientRepo.findByEmail(email).orElse(null);
    }
}
