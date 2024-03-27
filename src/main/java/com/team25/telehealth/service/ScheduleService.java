package com.team25.telehealth.service;

import com.team25.telehealth.dto.ScheduleDTO;
import com.team25.telehealth.entity.Appointment;
import com.team25.telehealth.entity.Doctor;
import com.team25.telehealth.entity.Schedule;
import com.team25.telehealth.helpers.generators.ScheduleIdGenerator;
import com.team25.telehealth.repo.AppointmentRepo;
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
    private final AppointmentRepo appointmentRepo;
    private final MailService mailService;

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

        for (Schedule s: inactiveSchedules) {
            Appointment appointment = appointmentRepo.findByDoctorAndSlotAndActive(doctor, s.getSlot(), true).orElse(null);
            if(appointment != null && appointment.getSlot().isAfter(LocalDateTime.now())) {
                appointment.setActive(false);
                appointmentRepo.save(appointment);
                mailService.sendEmail(appointment.getPatient().getEmail(),
                    "Doctor cancelled your appointment",
                    "Doctor Cancelled your upcoming appointment " + appointment.getSlot().toString()
                );
                mailService.sendEmail(appointment.getDoctor().getEmail(),
                    "Appointment Cancellation due to Schedule update",
                    "Your upcoming schedule with patient " + appointment.getPatient().getFirstName() +
                            " having email id " + appointment.getPatient().getEmail() + " got cancelled due to update in the schedule"
                        + ". Timing of the appointment was " + appointment.getSlot().toString()
                );
            }
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
