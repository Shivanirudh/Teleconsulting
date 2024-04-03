package com.team25.telehealth.repo;

import com.team25.telehealth.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PrescriptionRepo extends JpaRepository<Prescription, Integer> {
}
