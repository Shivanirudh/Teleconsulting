package com.team25.telehealthcronjob.repo;

import com.team25.telehealthcronjob.entity.Doctor;
import com.team25.telehealthcronjob.entity.Hospital;
import com.team25.telehealthcronjob.model.Specialization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DoctorRepo extends JpaRepository<Doctor, Integer> {
}
