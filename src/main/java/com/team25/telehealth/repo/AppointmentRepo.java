package com.team25.telehealth.repo;

import com.team25.telehealth.entity.Appointment;
import com.team25.telehealth.entity.Doctor;
import com.team25.telehealth.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AppointmentRepo extends JpaRepository<Appointment, Integer> {

    Optional<Appointment> findByAppointmentId(String appointmentId);

    List<Appointment> findAllByDoctor(Doctor doctor);

    List<Appointment> findAllByPatient(Patient patient);

    List<Appointment> findAllByPatientAndDoctor(Patient patient, Doctor doctor);

    Optional<Appointment> findByDoctorAndPatientAndSlot(Doctor doctor, Patient patient, LocalDateTime slot);

    Optional<Appointment> findByDoctorAndSlotAndActive(Doctor doctor, LocalDateTime slot, Boolean active);

    @Query("SELECT a FROM Appointment a WHERE a.doctor = :doctor AND a.patient = :patient AND a.active = :active AND DATE(a.slot) = :date")
    List<Appointment> getAllByDoctorAndPatientAndSlotDateAndActive(
            @Param("doctor") Doctor doctor,
            @Param("patient") Patient patient,
            @Param("date") LocalDate date,
            @Param("active") boolean active);

    @Query("SELECT a FROM Appointment a WHERE a.patient = :patient AND a.active = :active AND DATE(a.slot) = :date")
    List<Appointment> getAllByPatientAndSlotDateAndActive(
            @Param("patient") Patient patient,
            @Param("date") LocalDate date,
            @Param("active") boolean active);
}
