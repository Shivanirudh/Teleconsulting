package com.team25.telehealth.repo;

import com.team25.telehealth.entity.Doctor;
import com.team25.telehealth.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ScheduleRepo extends JpaRepository<Schedule, Integer> {
    List<Schedule> findAllByDoctorAndActive(Doctor doctor, Boolean active);

    Optional<Schedule> findByDoctorAndActiveAndSlot(Doctor doctor, Boolean active, LocalDateTime time);
}
