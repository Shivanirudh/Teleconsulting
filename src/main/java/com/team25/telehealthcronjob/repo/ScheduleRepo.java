package com.team25.telehealthcronjob.repo;

import com.team25.telehealthcronjob.entity.Doctor;
import com.team25.telehealthcronjob.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ScheduleRepo extends JpaRepository<Schedule, Integer> {

    @Query("SELECT s FROM Schedule s WHERE DATE(s.slot) < :date")
    List<Schedule> getSchedulesBeforeDate(LocalDate date);

    @Query("SELECT s FROM Schedule s WHERE s.active = :active AND DATE(s.slot) = :date")
    List<Schedule> getSchedulesActiveAndEqualDate(LocalDate date, boolean active);
}
