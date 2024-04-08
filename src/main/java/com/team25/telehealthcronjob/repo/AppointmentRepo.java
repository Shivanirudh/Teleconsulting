package com.team25.telehealthcronjob.repo;

import com.team25.telehealthcronjob.entity.Appointment;
import com.team25.telehealthcronjob.entity.Doctor;
import com.team25.telehealthcronjob.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AppointmentRepo extends JpaRepository<Appointment, Integer> {

}
