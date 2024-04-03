package com.team25.telehealth.service;

import com.team25.telehealth.dto.AppointmentDTO;
import com.team25.telehealth.dto.request.PrescriptionRequest;
import com.team25.telehealth.entity.Appointment;
import com.team25.telehealth.entity.Doctor;
import com.team25.telehealth.entity.Patient;
import com.team25.telehealth.entity.Schedule;
import com.team25.telehealth.helpers.PdfGenerator;
import com.team25.telehealth.helpers.exceptions.ResourceNotFoundException;
import com.team25.telehealth.helpers.generators.AppointmentIdGenerator;
import com.team25.telehealth.mappers.AppointmentMapper;
import com.team25.telehealth.repo.AppointmentRepo;
import com.team25.telehealth.repo.ScheduleRepo;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.StringTokenizer;

@Service
@AllArgsConstructor
public class AppointmentService {
    private final DoctorService doctorService;
    private final PatientService patientService;
    private final AppointmentRepo appointmentRepo;
    private final ScheduleRepo scheduleRepo;
    private final AppointmentIdGenerator appointmentIdGenerator;
    private final MailService mailService;
    private final AppointmentMapper appointmentMapper;
    private final PdfGenerator pdfGenerator;

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

    public List<AppointmentDTO> viewAppointments(Principal principal){
        Patient patient = patientService.getPatientByEmail(principal.getName());
        if(patient != null){
            return appointmentMapper.toDTOList(appointmentRepo.getAllByPatientAndActive(patient, true));
        }
        else{
            Doctor doctor = doctorService.getDoctorByEmail(principal.getName());
            if(doctor == null){
                throw new ResourceNotFoundException("User", "email", principal.getName());
            }
            return appointmentMapper.toDTOList(appointmentRepo.getAllByDoctorAndActive(doctor, true));
        }
    }

    public ResponseEntity<?> uploadPrescription(PrescriptionRequest prescriptionRequest, Principal principal) throws IOException {
        Doctor doctor = doctorService.getDoctorByEmail(principal.getName());
        Appointment appointment = appointmentRepo.findByAppointmentId(prescriptionRequest.getAppointmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "Id", prescriptionRequest.getAppointmentId()));
        if(!Objects.equals(doctor.getId(), appointment.getDoctor().getId())) {
            return ResponseEntity.badRequest().body("This Doctor can not perform this action for this appointment");
        }
        Patient patient = patientService.getPatientByPatientId(appointment.getPatient().getPatientId());
        pdfGenerator.generatePrescriptionPdfFromHTML(patient, doctor, prescriptionRequest, appointment.getAppointmentId());
        return ResponseEntity.ok("Created");
    }
}
