package com.team25.telehealth.service;

import com.team25.telehealth.dto.AppointmentDTO;
import com.team25.telehealth.entity.Appointment;
import com.team25.telehealth.entity.Doctor;
import com.team25.telehealth.entity.Patient;
import com.team25.telehealth.entity.Schedule;
import com.team25.telehealth.helpers.exceptions.ResourceNotFoundException;
import com.team25.telehealth.helpers.generators.AppointmentIdGenerator;
import com.team25.telehealth.repo.AppointmentRepo;
import com.team25.telehealth.repo.ScheduleRepo;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
public class AppointmentService {
    private final DoctorService doctorService;
    private final PatientService patientService;
    private final AppointmentRepo appointmentRepo;
    private final ScheduleRepo scheduleRepo;
    private final AppointmentIdGenerator appointmentIdGenerator;
    private final MailService mailService;

    @Transactional
    public ResponseEntity<?> bookAppointment(Principal principal, AppointmentDTO appointmentDTO) {
        Patient patient = patientService.getPatientByEmail(principal.getName());
        if(appointmentDTO.getDoctor() == null
                || appointmentDTO.getDoctor().getDoctorId() == null
                || appointmentDTO.getDoctor().getDoctorId().isEmpty()) {
            return ResponseEntity.badRequest().body("Doctor Id must be present");
        }
        Doctor doctor = doctorService.getDoctorByDoctorId(appointmentDTO.getDoctor().getDoctorId());
        Schedule schedule = scheduleRepo.findByDoctorAndActiveAndSlot(doctor, true, appointmentDTO.getSlot())
                .orElseThrow(() -> new ResourceNotFoundException("Slot", "time", appointmentDTO.getSlot().toString()));
        Appointment exists = appointmentRepo.findByDoctorAndSlotAndActive(doctor,
                appointmentDTO.getSlot(),
                true
                ).orElseGet(() -> null);

        if(exists != null) {
            return ResponseEntity.badRequest().body("Time slot is not available");
        }

        List<Appointment> appointmentsWithSameDoctor = appointmentRepo
                .getAllByDoctorAndPatientAndSlotDateAndActive(doctor, patient, appointmentDTO.getSlot().toLocalDate(), true);
        if(appointmentsWithSameDoctor.size() >= 2)
            return ResponseEntity.badRequest().body("You cannot book more than two appointments with the same doctor for a day");

        // Check if patient has already booked more than five appointments for the date
        List<Appointment> appointmentsForTheDay = appointmentRepo
                .getAllByPatientAndSlotDateAndActive(patient, appointmentDTO.getSlot().toLocalDate(), true);
        if(appointmentsForTheDay.size() >= 5)
            return ResponseEntity.badRequest().body("You cannot book more than five appointments for a day");

        Appointment appointment = Appointment.builder()
                .appointmentId(appointmentIdGenerator.generateNextId())
                .active(true)
                .meetingLink("Some link")
                .doctor(doctor)
                .slot(appointmentDTO.getSlot())
                .patient(patient)
                .build();

        appointmentRepo.save(appointment);
        mailService.sendEmail(
                patient.getEmail(),
                "Appointment Booked",
                "You just booked an appointment with Doctor " + doctor.getFirstName() + ". Date and time of appointment is " +
                        appointment.getSlot().toString()
        );
        mailService.sendEmail(
                doctor.getEmail(),
                "Appointment Booked",
                "Patient " + patient.getFirstName() + " just booked an appointment. Date and time of appointment is " +
                        appointment.getSlot().toString()
        );
        return ResponseEntity.ok("Appointment booked successfully");
    }

    public ResponseEntity<?> cancelAppointment(Principal principal, AppointmentDTO appointmentDTO) {
        Patient patient = patientService.getPatientByEmail(principal.getName());

        if(appointmentDTO == null || appointmentDTO.getAppointmentId() == null || appointmentDTO.getAppointmentId().isEmpty())
            return ResponseEntity.badRequest().body("Appointment Id must be present");
        Appointment appointment = appointmentRepo.findByAppointmentId(appointmentDTO.getAppointmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", appointmentDTO.getAppointmentId()));

        if(!appointment.getPatient().getId().equals(patient.getId())) {
            return ResponseEntity.badRequest().body("Wrong Appointment");
        }

        if(appointment.getSlot().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Cannot cancel the past appointments");
        }

        appointment.setActive(false);
        appointmentRepo.save(appointment);
        mailService.sendEmail(
                patient.getEmail(),
                "Appointment Canceled",
                "You just canceled an appointment with Doctor " + appointment.getDoctor().getFirstName()
                        + ". Date and time of appointment is " + appointment.getSlot().toString()
        );
        mailService.sendEmail(
                appointment.getDoctor().getEmail(),
                "Appointment Canceled",
                "Patient " + patient.getFirstName() + " just canceled an appointment. Date and time of appointment is " +
                        appointment.getSlot().toString()
        );
        return ResponseEntity.ok("Appointment canceled successfully");
    }
}
