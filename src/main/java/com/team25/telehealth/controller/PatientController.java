package com.team25.telehealth.controller;

import com.team25.telehealth.dto.PatientDTO;
import com.team25.telehealth.dto.AppointmentDTO;
import com.team25.telehealth.dto.request.AuthenticationRequest;
import com.team25.telehealth.dto.request.ConsentRequest;
import com.team25.telehealth.dto.request.DoctorSearchLDTO;
import com.team25.telehealth.dto.request.EmailRequest;
import com.team25.telehealth.entity.Doctor;
import com.team25.telehealth.entity.Hospital;
import com.team25.telehealth.mappers.PatientMapper;
import com.team25.telehealth.model.Specialization;
import com.team25.telehealth.entity.Appointment;

import com.team25.telehealth.service.*;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.print.Doc;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("api/v1/patient")
@AllArgsConstructor
public class PatientController {

    private final PatientService patientService;
    private final ConsentService consentService;
    private final AppointmentService appointmentService;
    private final HospitalService hospitalService;
    private final ScheduleService scheduleService;
    private final PatientMapper patientMapper;

    @GetMapping("/")
    public ResponseEntity<?> getPatient(@Valid @RequestBody EmailRequest email, Principal principal) {
        PatientDTO patientDTO = patientMapper.toDTO(patientService.getPatientByEmail(email.getEmail()));
        return ResponseEntity.status(HttpStatus.OK).body(patientDTO);
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("files") MultipartFile[] files, Principal principal) {
        return patientService.uploadFile(files, principal);
    }

    @GetMapping("/fetch/{fileName}")
    public ResponseEntity<?> fetchFile(Principal principal, @PathVariable String fileName) {
        return patientService.fetchFile(principal, fileName);
    }

    @PostMapping("/generateotp")
    public ResponseEntity<?> generateOTP(Principal principal) {
        return ResponseEntity.ok(patientService.generateOtp(principal));
    }

    @PutMapping("/changePassword")
    public ResponseEntity<?> changePassword(Principal principal, @RequestBody AuthenticationRequest req) {
        return patientService.changePassword(principal, req);
    }

    @GetMapping("/files")
    public ResponseEntity<?> fetchAllFileNames(Principal principal) {
        return patientService.fetchAllFileNames(principal);
    }

    @GetMapping("/consents-requested")
    public ResponseEntity<?> fetchAllConsentRequests(Principal principal) {
        return consentService.fetchAllConsentRequests(principal);
    }

    @PutMapping("/give-consent")
    public ResponseEntity<?> giveConsent(Principal principal, @Valid @RequestBody ConsentRequest request) {
        return consentService.giveConsent(principal, request);
    }

    @PutMapping("/update")
    public ResponseEntity<?> updatePatient(Principal principal, @RequestBody PatientDTO patientDTO){
        return patientService.updatePatient(principal, patientDTO);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> update(Principal principal) {
        return patientService.deletePatient(principal);
    }

    @PostMapping("/appointment")
    public ResponseEntity<?> bookAppointment(Principal principal, @Valid @RequestBody AppointmentDTO appointmentDTO) {
        return appointmentService.bookAppointment(principal, appointmentDTO);
    }

    @PostMapping("/cancel-appointment")
    public ResponseEntity<?> cancelAppointment(Principal principal, @RequestBody AppointmentDTO appointmentDTO) {
        return appointmentService.cancelAppointment(principal, appointmentDTO);
    }

    @GetMapping("/view-hospitals")
    public List<Hospital> viewHospitals(Principal principal){
        return hospitalService.listHospitals(principal);
    }

    @GetMapping("/list-doctors")
    public List<Doctor> listDoctors(Principal principal, @Valid @RequestBody DoctorSearchLDTO doctorSearchLDTO){
        return patientService.getDoctorsByHospital(principal, doctorSearchLDTO.getEmail(), doctorSearchLDTO.getSpecialization());
    }

    @GetMapping("/list-doctors-schedule")
    public ResponseEntity<?> fetchSchedule(Principal principal, @Valid @RequestBody String doctorID){
        return scheduleService.fetchSchedule(principal, doctorID);
    }
  
    @GetMapping("/list-appointments")
    public List<AppointmentDTO> listAppointments(Principal principal){
        return appointmentService.viewAppointments(principal);
    }

    @GetMapping("/fetch-prescription")
    public ResponseEntity<?> fetchPrescription(Principal principal, @RequestBody String appointmentId) {
        return appointmentService.fetchPrescriptionPatient(principal, appointmentId);
    }
}
