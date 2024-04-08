package com.team25.telehealthcronjob.services;

import com.team25.telehealthcronjob.entity.Schedule;
import com.team25.telehealthcronjob.entity.Token;
import com.team25.telehealthcronjob.entity.Validate;
import com.team25.telehealthcronjob.repo.ScheduleRepo;
import com.team25.telehealthcronjob.repo.TokenRepo;
import com.team25.telehealthcronjob.repo.ValidateRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final TokenRepo tokenRepo;
    private final ScheduleRepo scheduleRepo;
    private final ValidateRepo validateRepo;

    @Transactional
    public void createSchedule() {
        List<Schedule> schedules = scheduleRepo.getSchedulesActiveAndEqualDate(
                LocalDateTime.now().minusDays(1).toLocalDate(),
                true);

        for(Schedule schedule : schedules) {
            if(schedule.getDoctor().getActive()) schedule.setSlot(schedule.getSlot().plusDays(7));
        }

        scheduleRepo.saveAll(schedules);

        List<Schedule> deleteSchedule = scheduleRepo.getSchedulesBeforeDate(
                LocalDateTime.now().toLocalDate());
        scheduleRepo.deleteAll(deleteSchedule);
    }

    @Transactional
    public void deleteTokens() {
        List<Token> expiredOrRevoked = tokenRepo.findAllByExpiredOrRevoked(true, true);
        tokenRepo.deleteAll(expiredOrRevoked);
    }

    @Transactional
    public void deleteValidationData() {
        List<Validate> validates = validateRepo.findAll();
        validates.removeIf(validate -> !validate.getOtpExpiry().isBefore(LocalDateTime.now()));
        validateRepo.deleteAll(validates);
    }
}
