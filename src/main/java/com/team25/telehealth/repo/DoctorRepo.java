package com.team25.telehealth.repo;

import com.team25.telehealth.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DoctorRepo extends JpaRepository<Doctor, Integer> {
    public Optional<Doctor> findByEmail(String email);

    public Optional<Doctor> findByDoctorId(String doctorId);
}
