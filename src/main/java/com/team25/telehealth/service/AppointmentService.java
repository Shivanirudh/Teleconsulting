package com.team25.telehealth.service;

import com.team25.telehealth.dto.AppointmentDTO;
import com.team25.telehealth.dto.request.PrescriptionRequest;
import com.team25.telehealth.entity.*;
import com.team25.telehealth.helpers.EncryptionService;
import com.team25.telehealth.helpers.FileStorageService;
import com.team25.telehealth.helpers.PdfGenerator;
import com.team25.telehealth.helpers.exceptions.ResourceNotFoundException;
import com.team25.telehealth.helpers.generators.AppointmentIdGenerator;
import com.team25.telehealth.helpers.generators.PrescriptionIdGenerator;
import com.team25.telehealth.mappers.AppointmentMapper;
import com.team25.telehealth.model.Role;
import com.team25.telehealth.repo.AppointmentRepo;
import com.team25.telehealth.repo.PrescriptionRepo;
import com.team25.telehealth.repo.ScheduleRepo;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
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
    private final PrescriptionIdGenerator prescriptionIdGenerator;
    private final MailService mailService;
    private final AppointmentMapper appointmentMapper;
    private final PdfGenerator pdfGenerator;
    private final PrescriptionRepo prescriptionRepo;
    private final FileStorageService fileStorageService;
    private final EncryptionService encryptionService;

    private final String STORAGE_PATH = "D:\\Prashant Jain\\MTech\\Semester 2\\HAD\\Project\\Appointment_Data\\";

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

    public List<AppointmentDTO> viewAppointmentsPatient(Principal principal){
        Patient patient = patientService.getPatientByEmail(principal.getName());
        return appointmentMapper.toDTOList(appointmentRepo.getAllByPatientAndActive(patient, true));
    }

    public List<AppointmentDTO> viewAppointmentsDoctor(Principal principal){
        Doctor doctor = doctorService.getDoctorByEmail(principal.getName());
        return appointmentMapper.toDTOList(appointmentRepo.getAllByDoctorAndActive(doctor, true));
    }

    @Transactional
    public ResponseEntity<?> uploadPrescription(PrescriptionRequest prescriptionRequest, Principal principal) throws IOException {
        Doctor doctor = doctorService.getDoctorByEmail(principal.getName());
        Appointment appointment = appointmentRepo.findByAppointmentId(prescriptionRequest.getAppointmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "Id", prescriptionRequest.getAppointmentId()));
        if(!Objects.equals(doctor.getId(), appointment.getDoctor().getId())) {
            return ResponseEntity.badRequest().body("This Doctor can not perform this action for this appointment");
        }

        if(appointment.getPrescription() != null && appointment.getPrescription().getPrescriptionId().isEmpty() == false) {
            return ResponseEntity.badRequest().body("Prescription is already present. Not allowed to change it");
        }
        Patient patient = patientService.getPatientByPatientId(appointment.getPatient().getPatientId());
        pdfGenerator.generatePrescriptionPdfFromHTML(patient, doctor, prescriptionRequest, appointment.getAppointmentId());

        Prescription prescription = Prescription.builder()
                .prescriptionId(prescriptionIdGenerator.generateNextId())
                .appointment(appointment)
                .documentLink(appointment.getAppointmentId())
                .build();

        prescriptionRepo.save(prescription);

        return ResponseEntity.ok("Prescription uploaded successfully");
    }

    public ResponseEntity<?> fetchPrescriptionPatient(Principal principal, String appointmentId) {
        Patient patient = patientService.getPatientByEmail(principal.getName());
        Appointment appointment = appointmentRepo.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "Id", appointmentId));
        if(patient.getId() == appointment.getPatient().getId()) {
            return fetchDocument(appointment.getAppointmentId());
        } else {
            return ResponseEntity.badRequest().body("Not allowed to access this document");
        }
    }

    public ResponseEntity<?> fetchPrescriptionDoctor(Principal principal, String appointmentId) {
        Doctor doctor = doctorService.getDoctorByEmail(principal.getName());
        Appointment appointment = appointmentRepo.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "Id", appointmentId));
        if((doctor.getId() == appointment.getDoctor().getId()) ||
                (appointment.getDoctor().getHospital().getId() == doctor.getHospital().getId() && doctor.getRole().equals(Role.SENIORDOCTOR))) {
            return fetchDocument(appointment.getAppointmentId());
        } else {
            return ResponseEntity.badRequest().body("Not allowed to access this document");
        }
    }

    public ResponseEntity<?> fetchDocument(String fileName) {
        try {
            fileName = fileName+".pdf";
            String filePath = STORAGE_PATH + fileName;
            File file = fileStorageService.getFile(filePath);
            if (file.exists()) {
                // Fetch encryption key and decrypt file
                // Assuming you have a method to fetch the key based on user ID
//                byte[] decryptedContent = encryptionService.decryptFile(filePath);

                // Set response headers to trigger download in Postman
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_PDF);
                headers.setContentDispositionFormData(fileName, fileName);
                return  new ResponseEntity<>(Files.readAllBytes(Paths.get(filePath)), headers, HttpStatus.OK);
//                return new ResponseEntity<>(decryptedContent, headers, HttpStatus.OK);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
