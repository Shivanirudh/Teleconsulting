package com.team25.telehealth.controller;

import com.team25.telehealth.dto.*;
import com.team25.telehealth.dto.request.AuthenticationRequest;
import com.team25.telehealth.dto.request.EmailRequest;
import com.team25.telehealth.dto.request.PrescriptionRequest;
import com.team25.telehealth.entity.Appointment;
import com.team25.telehealth.entity.Doctor;
import com.team25.telehealth.entity.Hospital;
import com.team25.telehealth.service.*;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("api/v1/doctor")
@AllArgsConstructor
public class DoctorController {
    private final DoctorService doctorService;
    private final ConsentService consentService;
    private final ScheduleService scheduleService;
    private final AppointmentService appointmentService;
    private final PatientService patientService;
    private final HospitalService hospitalService;

    @GetMapping("/")
    public ResponseEntity<?> getDoctor(Principal principal) {
        return ResponseEntity.status(HttpStatus.OK).body(doctorService.getDoctor(principal));
    }

//    @PostMapping("/")
//    public ResponseEntity<?> addDoctor(@RequestBody Doctor doctor, Principal principal) {
//        return ResponseEntity.status(HttpStatus.OK).body(doctorService.addDoctor(doctor));
//    }

    @PostMapping("/generateotp")
    public ResponseEntity<?> generateOTP(Principal principal) {
        return ResponseEntity.ok(doctorService.generateOtp(principal));
    }

    @PutMapping("/changePassword")
    public ResponseEntity<?> changePassword(Principal principal, @RequestBody AuthenticationRequest req) {
        return doctorService.changePassword(principal, req);
    }

    @PostMapping("/consent")
    public ResponseEntity<?> getConsent(Principal principal,@RequestBody ConsentDTO consentDTO) {
        return consentService.getConsent(principal, consentDTO);
    }

    @GetMapping("/consent")
    public ResponseEntity<?> checkDoctorConsents(Principal principal) {
        return consentService.checkDoctorConsents(principal);
    }

    @GetMapping("/consent/{consentId}/patient/{patientId}")
    public ResponseEntity<?> fetchDocument(Principal principal, @PathVariable String consentId, @PathVariable String patientId) {
        return consentService.fetchDocument(principal, consentId, patientId);
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateDoctor(Principal principal, @RequestBody DoctorDTO doctorDTO){
        return doctorService.updateDoctor(principal, doctorDTO);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteDoctor(Principal principal) {
        return doctorService.deleteDoctor(principal);
    }
    
    @PostMapping("/schedule")
    public ResponseEntity<?> uploadSchedule(Principal principal, @Valid @RequestBody ScheduleDTO scheduleDTO) {
        return scheduleService.uploadSchedule(principal, scheduleDTO);
    }

    @GetMapping("/schedule")
    public ResponseEntity<?> fetchSchedule(Principal principal) {
        return scheduleService.fetchSchedule(principal);
    }

    @GetMapping("/list-appointments")
    public List<AppointmentDTO> listAppointments(Principal principal){
        return appointmentService.viewAppointmentsDoctor(principal);
    }

    @PostMapping("/upload-prescription")
    public ResponseEntity<?> uploadPrescription(@RequestBody PrescriptionRequest prescriptionRequest, Principal principal)
            throws Exception {
        return appointmentService.uploadPrescription(prescriptionRequest, principal);
    }

    @GetMapping("/fetch-prescription/{appointmentId}")
    public ResponseEntity<?> fetchPrescription(Principal principal, @PathVariable String appointmentId) {
        return appointmentService.fetchPrescriptionDoctor(principal, appointmentId);
    }

    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<?> fetchAppointment(Principal principal, @PathVariable String appointmentId) {
        return appointmentService.fetchAppointmentDoctor(principal, appointmentId);
    }

    @GetMapping("/fetch-files/{patientId}")
    public ResponseEntity<?> fetchAllFileNames(Principal principal, @PathVariable String patientId) {
        return patientService.fetchAllFileNames(patientId);
    }

    @GetMapping("/view-hospitals")
    public List<HospitalDTO> viewHospitals(Principal principal){
        return hospitalService.listHospitals(principal);
    }

    @GetMapping("/list-doctors-hospital/{email}")
    public List<DoctorDTO> listDoctorsByHospital(Principal principal, @PathVariable String email){
        return patientService.getDoctorsByHospital(principal, email);
    }
}
