package com.team25.telehealthcronjob.components;

import com.team25.telehealthcronjob.services.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ScheduledTasks {
    private final ScheduleService scheduleService;

    @Scheduled(cron = "0 * * * * *")
    public void execute() {
        System.out.println("Cron job initialized");
        scheduleService.createSchedule();
    }
}
