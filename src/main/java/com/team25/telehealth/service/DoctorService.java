package com.team25.telehealth.service;

import com.team25.telehealth.dto.DoctorDTO;
import com.team25.telehealth.dto.request.AuthenticationRequest;
import com.team25.telehealth.entity.Doctor;
import com.team25.telehealth.entity.Hospital;
import com.team25.telehealth.entity.Patient;
import com.team25.telehealth.helpers.exceptions.ResourceNotFoundException;
import com.team25.telehealth.helpers.generators.DoctorIdGenerator;
import com.team25.telehealth.helpers.OtpHelper;
import com.team25.telehealth.mappers.DoctorMapper;
import com.team25.telehealth.repo.DoctorRepo;
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
import java.util.Optional;

import static com.team25.telehealth.model.Role.DOCTOR;

@Service
@AllArgsConstructor
public class DoctorService {
    private final DoctorRepo doctorRepo;
    private final PasswordEncoder passwordEncoder;
    private final DoctorIdGenerator doctorIdGenerator;
    private final OtpHelper otpHelper;
    private final MailService mailService;
    private final DoctorMapper doctorMapper;
    private final EntityManager entityManager;

    @Transactional
    public ResponseEntity<?> addDoctor(Principal principal, DoctorDTO doctorDTO, Hospital hospital) {
        Doctor doctor = doctorMapper.toEntity(doctorDTO);
        if(isDuplicateDoctor(doctor)) {
            return ResponseEntity.badRequest().body("Email, Phone number should be unique");
        }
        doctor.setDoctorId(doctorIdGenerator.generateNextId());
        doctor.setActive(true);
        doctor.setHospital(hospital);
        doctor.setPassword(passwordEncoder.encode("1234"));
        doctorRepo.save(doctor);
        return ResponseEntity.ok("Doctor Saved Successfully");
    }

    public DoctorDTO getDoctor(Principal principal) {
        Doctor doctor = doctorRepo.findByEmail(principal.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "Email", principal.getName()));
        return doctorMapper.toDTO(doctor);
    }

    public Doctor getDoctorByEmail(String email) {
        if (email == null || email.isEmpty()) return null;
        return doctorRepo.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("Doctor", "email", email));
    }

    @Transactional
    public String generateOtp(Principal principal) {
        String adminEmail = principal.getName();
        Doctor doctor = getDoctorByEmail(adminEmail);
        doctor.setOtp(otpHelper.generateOtp());
        doctor.setOtpExpiry(otpHelper.generateExpirationTime());
        doctorRepo.save(doctor);
        mailService.sendEmail(doctor.getEmail(),
                "OTP For TeleHealth Website",
                doctor.getOtp() + " This is the OTP generated for your account. Do not Share it with anyone.");
        return "Otp generated Successfully";
    }

    public ResponseEntity<?> changePassword(Principal principal, AuthenticationRequest req) {
        Doctor doctor = getDoctorByEmail(principal.getName());
        if(!otpHelper.otpCheck(req.getOtp(), doctor.getOtp(), doctor.getOtpExpiry())) {
            return ResponseEntity.badRequest().body("OTP is wrong or expired");
        }
        if(!req.getPassword().equals(req.getRetypePassword())
                || !(req.getPassword().length() >= 4 && req.getPassword().length() <= 255)) {
            return ResponseEntity.badRequest()
                    .body("Passwords should be same. Password should have atleast 4 characters and atmost 255");
        }
        doctor.setPassword(passwordEncoder.encode(req.getPassword()));
        doctorRepo.save(doctor);
        return ResponseEntity.ok("Password Changed Successfully");
    }

    private boolean isDuplicateDoctor(Doctor doctor) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Doctor> query = cb.createQuery(Doctor.class);
        Root<Doctor> root = query.from(Doctor.class);

        Predicate predicate = cb.or(
                cb.equal(root.get("phoneNo"), doctor.getPhoneNo()),
                cb.equal(root.get("email"), doctor.getEmail())
        );

        query.where(predicate);
        TypedQuery<Doctor> typedQuery = entityManager.createQuery(query);

        var count = typedQuery.getResultList();

        return !count.isEmpty();
    }

    public Doctor getDoctorByDoctorId(String doctorId) {
        return doctorRepo.findByDoctorId(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId));
    }

    public ResponseEntity<?> updateDoctor(Principal principal, DoctorDTO doctorDTO){
        Doctor doctor = getDoctorByEmail(principal.getName());
        if(doctorDTO.getFirstName() != null)
            doctor.setFirstName(doctorDTO.getFirstName());
        if(doctorDTO.getLastName() != null)
            doctor.setLastName(doctorDTO.getLastName());
        doctorRepo.save(doctor);
        return ResponseEntity.ok("Doctor Updated Successfully");
    }

    public ResponseEntity<?> deleteDoctor(Principal principal){
        Doctor doctor = getDoctorByEmail(principal.getName());
        doctor.setActive(false);
        doctorRepo.save(doctor);
        return ResponseEntity.ok("Doctor deleted Successfully");
    }
}
