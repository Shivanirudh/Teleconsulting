package com.team25.telehealth.service;

import com.team25.telehealth.dto.DoctorDTO;
import com.team25.telehealth.dto.HospitalDTO;
import com.team25.telehealth.dto.PatientDTO;
import com.team25.telehealth.dto.request.AuthenticationRequest;
import com.team25.telehealth.entity.Admin;
import com.team25.telehealth.entity.Doctor;
import com.team25.telehealth.entity.Hospital;
import com.team25.telehealth.entity.Patient;
import com.team25.telehealth.helpers.exceptions.ResourceNotFoundException;
import com.team25.telehealth.helpers.generators.AdminIdGenerator;
import com.team25.telehealth.helpers.OtpHelper;
import com.team25.telehealth.helpers.generators.HospitalIdGenerator;
import com.team25.telehealth.mappers.AdminMapper;
import com.team25.telehealth.mappers.DoctorMapper;
import com.team25.telehealth.mappers.HospitalMapper;
import com.team25.telehealth.mappers.PatientMapper;
import com.team25.telehealth.repo.AdminRepo;
import com.team25.telehealth.repo.DoctorRepo;
import com.team25.telehealth.repo.HospitalRepo;
import com.team25.telehealth.repo.PatientRepo;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.print.Doc;
import java.security.Principal;
import java.util.List;

import static com.team25.telehealth.model.Role.ADMIN;

@Service
@AllArgsConstructor
public class AdminService {
    private final EntityManager entityManager;
    private final AdminRepo adminRepo;
    private final DoctorService doctorService;
    private final PasswordEncoder passwordEncoder;
    private final AdminIdGenerator adminIdGenerator;
    private final MailService mailService;
    private final OtpHelper otpHelper;
    private final AdminMapper adminMapper;
    private final HospitalMapper hospitalMapper;
    private final HospitalService hospitalService;
    private final PatientService patientService;
    private final PatientRepo patientRepo;
    private final DoctorRepo doctorRepo;
    private final HospitalRepo hospitalRepo;
    private final PatientMapper patientMapper;
    private final DoctorMapper doctorMapper;

    @Transactional
    public Admin addAdmin(Admin admin) {
        admin.setRole(ADMIN);
        admin.setAdminId(adminIdGenerator.generateNextId());
        admin.setActive(true);
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        return adminRepo.save(admin);
    }

    public Admin getAdminByEmail(String email) {
        if (email == null || email.isEmpty()) return null;
        return adminRepo.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("Admin", "email", email));
    }

    @Transactional
    public String generateOtp(Principal principal) {
        String adminEmail = principal.getName();
        Admin admin = getAdminByEmail(adminEmail);
        admin.setOtp(otpHelper.generateOtp());
        admin.setOtpExpiry(otpHelper.generateExpirationTime());
        adminRepo.save(admin);
        mailService.sendEmail(admin.getEmail(),
                "OTP For TeleHealth Website",
                admin.getOtp() + " This is the OTP generated for your account. Do not Share it with anyone.");
        return "Otp generated Successfully";
    }

    public ResponseEntity<?> changePassword(Principal principal, AuthenticationRequest req) {
        Admin admin = getAdminByEmail(principal.getName());
        if(!otpHelper.otpCheck(req.getOtp(), admin.getOtp(), admin.getOtpExpiry())) {
            return ResponseEntity.badRequest().body("OTP is wrong or expired");
        }
        if(!req.getPassword().equals(req.getRetypePassword())
                || !(req.getPassword().length() >= 4 && req.getPassword().length() <= 255)) {
            return ResponseEntity.badRequest()
                    .body("Passwords should be same. Password should have atleast 4 characters and atmost 255");
        }
        admin.setPassword(passwordEncoder.encode(req.getPassword()));
        adminRepo.save(admin);
        return ResponseEntity.ok("Password Changed Successfully");
    }

    public ResponseEntity<?> addHospital(Principal principal, HospitalDTO hospitalDTO) {
        return hospitalService.addHospital(principal, hospitalDTO);
    }

    public ResponseEntity<?> addDoctor(Principal principal, DoctorDTO doctorDTO) {
        if(doctorDTO.getHospital().getHospitalId() == null || doctorDTO.getHospital().getHospitalId().isEmpty())
            return ResponseEntity.badRequest().body("Hospital of the doctor must be provided");
        Hospital hospital = hospitalService.findByHospitalId(doctorDTO.getHospital().getHospitalId());
        return doctorService.addDoctor(principal, doctorDTO, hospital);
    }

    public ResponseEntity<?> blockPatient(Principal principal, String patientId){
        Patient patient = patientService.getPatientByPatientId(patientId);
        if(!patient.getActive()){
            return ResponseEntity.badRequest().body("Patient already blocked");
        }
        patient.setActive(false);
        patientRepo.save(patient);
        return ResponseEntity.ok("Patient blocked Successfully");
    }

    public ResponseEntity<?> unblockPatient(Principal principal, String patientId){
        Patient patient = patientService.getPatientByPatientId(patientId);
        if(patient.getActive()){
            return ResponseEntity.badRequest().body("Patient already unblocked");
        }
        patient.setActive(true);
        patientRepo.save(patient);
        return ResponseEntity.ok("Patient unblocked Successfully");
    }

    public ResponseEntity<?> blockDoctor(Principal principal, String doctorId){
        Doctor doctor = doctorService.getDoctorByDoctorId(doctorId);
        if(!doctor.getActive()){
            return ResponseEntity.badRequest().body("Doctor already blocked");
        }
        doctor.setActive(false);
        doctorRepo.save(doctor);
        return ResponseEntity.ok("Doctor blocked Successfully");
    }

    public ResponseEntity<?> unblockDoctor(Principal principal, String doctorId){
        Doctor doctor = doctorService.getDoctorByDoctorId(doctorId);
        if(doctor.getActive()){
            return ResponseEntity.badRequest().body("Doctor already unblocked");
        }
        doctor.setActive(true);
        doctorRepo.save(doctor);
        return ResponseEntity.ok("Doctor unblocked Successfully");
    }

    public ResponseEntity<?> blockHospital(Principal principal, String hospitalId) {
        Hospital hospital = hospitalService.findByHospitalId(hospitalId);
        if (!hospital.getActive()) {
            return ResponseEntity.badRequest().body("Hospital already blocked");
        }
        hospital.setActive(false);
        hospitalRepo.save(hospital);
        return ResponseEntity.ok("Hospital blocked Successfully");
    }

    public ResponseEntity<?> unblockHospital(Principal principal, String hospitalId) {
        Hospital hospital = hospitalService.findByHospitalId(hospitalId);
        if (hospital.getActive()) {
            return ResponseEntity.badRequest().body("Hospital already unblocked");
        }
        hospital.setActive(true);
        hospitalRepo.save(hospital);
        return ResponseEntity.ok("Hospital unblocked Successfully");
    }
    public ResponseEntity<?> getPatients(Principal principal) {
        List<Patient> patients = patientRepo.findAll();
        List<PatientDTO> res = patientMapper.toDTOList(patients);
        return ResponseEntity.ok(res);
    }

    public ResponseEntity<?> getDoctors(Principal principal) {
        List<Doctor> doctors = doctorRepo.findAll();
        List<DoctorDTO> res = doctorMapper.toDTOList(doctors);
        return ResponseEntity.ok(res);
    }
}
