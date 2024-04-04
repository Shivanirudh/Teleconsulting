package com.team25.telehealth.repo;

import com.team25.telehealth.entity.Doctor;
import com.team25.telehealth.entity.Hospital;
import com.team25.telehealth.model.Specialization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DoctorRepo extends JpaRepository<Doctor, Integer> {
    public Optional<Doctor> findByEmail(String email);

    public Optional<Doctor> findByDoctorId(String doctorId);

    @Query("SELECT d FROM Doctor d WHERE d.hospital=:hospital and d.active=:active")
    public List<Doctor> getByHospitalAndActive(
            @Param("hospital") Hospital hospital,
            @Param("active") boolean active);

    @Query("SELECT d FROM Doctor d WHERE d.hospital=:hospital and d.active=:active and d.specialization=:specialization")
    public List<Doctor> getByHospitalAndActiveAndSpecialization(
            @Param("hospital") Hospital hospital,
            @Param("active") boolean active,
            @Param("specialization") Specialization specialization);

    @Query("SELECT d FROM Doctor d WHERE d.active=:active and d.specialization=:specialization")
    public List<Doctor> getByActiveAndSpecialization(
            @Param("active") boolean active,
            @Param("specialization") Specialization specialization);
}
