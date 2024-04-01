package com.team25.telehealth.repo;

import com.team25.telehealth.entity.Doctor;
import com.team25.telehealth.entity.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface HospitalRepo extends JpaRepository<Hospital, Integer> {
    public Optional<Hospital> findByEmail(String email);

    public Optional<Hospital> findByHospitalId(String hospitalId);

    public Optional<Hospital> findByDoctor(Doctor doctor);

    public List<Hospital> getAllByActive(
            @Param("active") boolean active
    );
}
