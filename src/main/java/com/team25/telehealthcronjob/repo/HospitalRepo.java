package com.team25.telehealthcronjob.repo;

import com.team25.telehealthcronjob.entity.Doctor;
import com.team25.telehealthcronjob.entity.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface HospitalRepo extends JpaRepository<Hospital, Integer> {
}
