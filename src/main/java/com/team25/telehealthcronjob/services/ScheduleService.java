package com.team25.telehealthcronjob.services;

import com.team25.telehealthcronjob.entity.Schedule;
import com.team25.telehealthcronjob.repo.ScheduleRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleRepo scheduleRepo;

    @Transactional
    public void createSchedule() {
        List<Schedule> schedules = scheduleRepo.getSchedulesActiveAndEqualDate(
                LocalDateTime.now().minusDays(1).toLocalDate(),
                true);

        for(Schedule schedule : schedules) {
            schedule.setSlot(schedule.getSlot().plusDays(7));
        }

        scheduleRepo.saveAll(schedules);

        List<Schedule> deleteSchedule = scheduleRepo.getSchedulesBeforeDate(
                LocalDateTime.now().toLocalDate());
        scheduleRepo.deleteAll(deleteSchedule);
    }
}
