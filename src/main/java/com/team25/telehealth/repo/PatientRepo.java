package com.team25.telehealth.repo;

import com.team25.telehealth.entity.Doctor;
import com.team25.telehealth.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PatientRepo extends JpaRepository<Patient, Integer> {
    public Optional<Patient> findByEmail(String email);
    public Optional<Patient> findByPatientId(String patientId);
}
