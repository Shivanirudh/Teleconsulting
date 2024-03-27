package com.team25.telehealth.service;

import com.team25.telehealth.dto.ScheduleDTO;
import com.team25.telehealth.entity.Doctor;
import com.team25.telehealth.entity.Schedule;
import com.team25.telehealth.helpers.generators.ScheduleIdGenerator;
import com.team25.telehealth.repo.ScheduleRepo;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.*;

@Service
@AllArgsConstructor
public class ScheduleService {

    private final DoctorService doctorService;
    private final ScheduleRepo scheduleRepo;
    private final ScheduleIdGenerator scheduleIdGenerator;

    @Transactional
    public ResponseEntity<?> uploadSchedule(Principal principal, ScheduleDTO scheduleDTO) {
        Doctor doctor = doctorService.getDoctorByEmail(principal.getName());
        List<Schedule> activeSchedules = scheduleRepo.findAllByDoctorAndActive(doctor, true);

        Set<LocalDateTime> scheduleDTOSlots = new HashSet<>(Arrays.asList(scheduleDTO.getSlot()));

//        List<Schedule> updatedActiveSchedules = new ArrayList<>();
        List<Schedule> inactiveSchedules = new ArrayList<>();

        for (Schedule schedule : activeSchedules) {
            if (scheduleDTOSlots.contains(schedule.getSlot())) {
                scheduleDTOSlots.remove(schedule.getSlot());
//                updatedActiveSchedules.add(schedule);
            } else {
                schedule.setActive(false);
                inactiveSchedules.add(schedule);
            }
        }

        for (LocalDateTime slot : scheduleDTOSlots) {
            Schedule newSchedule = Schedule.builder()
                    .scheduleId(scheduleIdGenerator.generateNextId())
                    .active(true)
                    .slot(slot)
                    .doctor(doctor)
                    .build();
            scheduleRepo.save(newSchedule);
        }

        scheduleRepo.saveAll(inactiveSchedules);

        return ResponseEntity.ok("Schedule Updated Successfully");
    }

    public ResponseEntity<?> fetchSchedule(Principal principal) {
        Doctor doctor = doctorService.getDoctorByEmail(principal.getName());
        List<Schedule> schedules = scheduleRepo.findAllByDoctorAndActive(doctor, true);
        ScheduleDTO response = new ScheduleDTO();
        List<LocalDateTime> slots = new ArrayList<>();

        for (Schedule schedule : schedules) {
            slots.add(schedule.getSlot());
        }

        response.setSlot(slots.toArray(new LocalDateTime[0]));
        return ResponseEntity.ok(response);
    }
}
