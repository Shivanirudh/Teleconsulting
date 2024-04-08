package com.team25.telehealthcronjob.repo;

import com.team25.telehealthcronjob.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PatientRepo extends JpaRepository<Patient, Integer> {
}
