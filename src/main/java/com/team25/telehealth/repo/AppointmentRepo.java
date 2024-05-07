package com.team25.telehealth.repo;

import com.team25.telehealth.entity.Appointment;
import com.team25.telehealth.entity.Doctor;
import com.team25.telehealth.entity.Hospital;
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

    List<Appointment> findAllByDoctorAndSlotAndActive(Doctor doctor, LocalDateTime slot, Boolean active);

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

    @Query("SELECT a FROM Appointment a WHERE a.doctor = :doctor AND a.active = :active AND DATE(a.slot) = :date")
    List<Appointment> getAllByDoctorAndSlotDateAndActive(
            @Param("doctor") Doctor doctor,
            @Param("date") LocalDate date,
            @Param("active") boolean active);

    @Query("SELECT a FROM Appointment a WHERE a.doctor = :doctor AND a.active = :active")
    List<Appointment> getAllByDoctorAndActive(
            @Param("doctor") Doctor doctor,
            @Param("active") boolean active);

    @Query("SELECT a FROM Appointment a WHERE a.patient = :patient AND a.active = :active")
    List<Appointment> getAllByPatientAndActive(
            @Param("patient") Patient patient,
            @Param("active") boolean active);

    @Query("SELECT a FROM Appointment a WHERE a.doctor = :doctor AND a.active = :active AND DATE(a.slot) BETWEEN :start_date AND :end_date")
    List<Appointment> getAllByDoctorAndActiveAndSlotDateBetween(
            @Param("doctor") Doctor doctor,
            @Param("active") Boolean active,
            @Param("start_date") LocalDate startDate,
            @Param("end_date") LocalDate endDate);

    @Query("SELECT a FROM Appointment a WHERE a.patient = :patient AND a.active = :active AND DATE(a.slot) BETWEEN :start_date AND :end_date")
    List<Appointment> getAllByPatientAndActiveAndSlotDateBetween(
            @Param("patient") Patient patient,
            @Param("active") Boolean active,
            @Param("start_date") LocalDate startDate,
            @Param("end_date") LocalDate endDate);

    @Query("SELECT a FROM Appointment a WHERE a.doctor.hospital = :hospital AND a.active = :active AND Date(a.slot) = :date")
    List<Appointment> getAllByHospitalAndActiveAndSlotDateBetween(
            @Param("hospital") Hospital hospital,
            @Param("active") Boolean active,
            @Param("date") LocalDate date);
}
