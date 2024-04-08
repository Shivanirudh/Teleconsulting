package com.team25.telehealthcronjob.repo;

import com.team25.telehealthcronjob.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PrescriptionRepo extends JpaRepository<Prescription, Integer> {
}
