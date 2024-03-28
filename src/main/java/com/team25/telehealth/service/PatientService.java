package com.team25.telehealth.service;

import com.team25.telehealth.dto.PatientDTO;
import com.team25.telehealth.dto.request.AuthenticationRequest;
import com.team25.telehealth.entity.Doctor;
import com.team25.telehealth.entity.Patient;
import com.team25.telehealth.helpers.EncryptionService;
import com.team25.telehealth.helpers.FileStorageService;
import com.team25.telehealth.helpers.OtpHelper;
import com.team25.telehealth.helpers.exceptions.ResourceNotFoundException;
import com.team25.telehealth.helpers.generators.PatientIdGenerator;
import com.team25.telehealth.mappers.PatientMapper;
import com.team25.telehealth.repo.PatientRepo;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.InputStream;
import java.security.Principal;
import java.util.List;

import static com.team25.telehealth.model.Role.PATIENT;

@Service
@AllArgsConstructor
public class PatientService {
    private final PatientRepo patientRepo;
    private final PasswordEncoder passwordEncoder;
    private final PatientIdGenerator patientIdGenerator;
    private final OtpHelper otpHelper;
    private final MailService mailService;
    private final FileStorageService fileStorageService;
    private final EncryptionService encryptionService;
    private final PatientMapper patientMapper;
    private final  EntityManager entityManager;

    private final String STORAGE_PATH = "D:\\Prashant Jain\\MTech\\Semester 2\\HAD\\Project\\Patient_Data\\";

    @Transactional
    public Patient addPatient(Patient patient) {
        System.out.println(patient.getPassword());
        patient.setRole(PATIENT);
        patient.setPatientId(patientIdGenerator.generateNextId());
        patient.setActive(true);
        patient.setPassword(passwordEncoder.encode(patient.getPassword()));
        return patientRepo.save(patient);
    }

    public Patient getPatientByEmail(String email) {
        if (email == null || email.isEmpty()) return null;
        return patientRepo.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("Patient", "email", email));
    }

    @Transactional
    public String generateOtp(Principal principal) {
        String patientEmail = principal.getName();
        Patient patient = getPatientByEmail(patientEmail);
        patient.setOtp(otpHelper.generateOtp());
        patient.setOtpExpiry(otpHelper.generateExpirationTime());
        patientRepo.save(patient);
        mailService.sendEmail(patient.getEmail(),
                "OTP For TeleHealth Website",
                patient.getOtp() + " This is the OTP generated for your account. Do not Share it with anyone.");
        return "Otp generated Successfully";
    }

    @Transactional
    public ResponseEntity<String> uploadFile(MultipartFile[] files, Principal principal) {
        Patient patient = getPatientByEmail(principal.getName());
        try {
            String folderPath = STORAGE_PATH + patient.getPatientId();
            for (MultipartFile file : files) {
                String filePath = folderPath + File.separator + file.getOriginalFilename();
                fileStorageService.storeFile(folderPath, file);
                try (InputStream inputStream = new ByteArrayInputStream(file.getBytes())) {
                    encryptionService.encryptAndStoreFile(filePath, inputStream);
                }
            }
            return ResponseEntity.ok().body("Files uploaded successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload files: " + e.getMessage());
        }
    }

    public ResponseEntity<?> fetchFile(Principal principal, String fileName) {
        Patient patient = getPatientByEmail(principal.getName());
        try {
            String filePath = STORAGE_PATH + patient.getPatientId() + File.separator + fileName;
            File file = fileStorageService.getFile(filePath);
            if (file.exists()) {
                // Fetch encryption key and decrypt file
                // Assuming you have a method to fetch the key based on user ID
                byte[] decryptedContent = encryptionService.decryptFile(filePath);

                // Set content type based on file extension
                MediaType mediaType = getMediaTypeForFileName(fileName);

                // Set response headers to trigger download in Postman
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(mediaType);
                headers.setContentDispositionFormData(fileName, fileName);

                return new ResponseEntity<>(decryptedContent, headers, HttpStatus.OK);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public ResponseEntity<?> fetchFile(Patient patient, String fileName) {

        try {
            String filePath = STORAGE_PATH + patient.getPatientId() + File.separator + fileName;
            File file = fileStorageService.getFile(filePath);
            if (file.exists()) {
                // Fetch encryption key and decrypt file
                // Assuming you have a method to fetch the key based on user ID
                byte[] decryptedContent = encryptionService.decryptFile(filePath);

                // Set content type based on file extension
                MediaType mediaType = getMediaTypeForFileName(fileName);

                // Set response headers to trigger download in Postman
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(mediaType);
                headers.setContentDispositionFormData(fileName, fileName);

                return new ResponseEntity<>(decryptedContent, headers, HttpStatus.OK);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public ResponseEntity<?> fetchAllFileNames(Principal principal) {
        Patient patient = getPatientByEmail(principal.getName());
        try {
            String folderPath = STORAGE_PATH + patient.getPatientId();
            List<String> fileNames = fileStorageService.getAllFileNames(folderPath);
            return ResponseEntity.ok().body(fileNames);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private MediaType getMediaTypeForFileName(String fileName) {
        if (fileName.endsWith(".pdf")) {
            return MediaType.APPLICATION_PDF;
        } else if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
            return MediaType.IMAGE_JPEG;
        } else if (fileName.endsWith(".png")) {
            return MediaType.IMAGE_PNG;
        }
        // Default to octet-stream for unknown file types
        return MediaType.APPLICATION_OCTET_STREAM;
    }

    public ResponseEntity<?> changePassword(Principal principal, AuthenticationRequest req) {
        Patient patient = getPatientByEmail(principal.getName());
        if(!otpHelper.otpCheck(req.getOtp(), patient.getOtp(), patient.getOtpExpiry())) {
            return ResponseEntity.badRequest().body("OTP is wrong or expired");
        }
        if(!req.getPassword().equals(req.getRetypePassword())
                || !(req.getPassword().length() >= 4 && req.getPassword().length() <= 255)) {
            return ResponseEntity.badRequest()
                    .body("Passwords should be same. Password should have atleast 4 characters and atmost 255");
        }
        patient.setPassword(passwordEncoder.encode(req.getPassword()));
        patientRepo.save(patient);
        return ResponseEntity.ok("Password Changed Successfully");
    }

    public Patient getPatientByPatientId(String patientId) {
        return patientRepo.findByPatientId(patientId).orElseThrow(() -> new ResourceNotFoundException("Patient", "Patient Id", patientId));
    }

    public boolean documentExists(Patient patient, String fileName) {
        String filePath = STORAGE_PATH + patient.getPatientId() + File.separator + fileName;
        File file = fileStorageService.getFile(filePath);
        return file.exists();
    }

    private boolean isExistPatient(Patient patient) {

        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Patient> query = cb.createQuery(Patient.class);
        Root<Patient> root = query.from(Patient.class);

        Predicate predicate = cb.or(
                cb.equal(root.get("email"), patient.getEmail())
        );

        query.where(predicate);
        TypedQuery<Patient> typedQuery = entityManager.createQuery(query);

        var count = typedQuery.getResultList();

        return !count.isEmpty();
    }
    public ResponseEntity<?> updatePatient(Principal principal, PatientDTO patientDTO){
        Patient patient = getPatientByEmail(principal.getName());
        if(patientDTO.getFirstName() != null)
            patient.setFirstName(patientDTO.getFirstName());
        if(patientDTO.getLastName() != null)
            patient.setLastName(patientDTO.getLastName());
        if(patientDTO.getGender() != null)
            patient.setGender(patientDTO.getGender());
        if(patientDTO.getHeight() != null)
            patient.setHeight(patientDTO.getHeight());
        if(patientDTO.getWeight() != null)
            patient.setWeight(patientDTO.getWeight());
        patientRepo.save(patient);
        return ResponseEntity.ok("Patient Updated Successfully");
    }

    public ResponseEntity<?> deletePatient(Principal principal){
        Patient patient = getPatientByEmail(principal.getName());
        patient.setActive(false);
        patientRepo.save(patient);
        return ResponseEntity.ok("Patient deleted Successfully");
    }
}
