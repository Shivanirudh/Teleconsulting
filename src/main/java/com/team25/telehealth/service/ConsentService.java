package com.team25.telehealth.service;

import com.team25.telehealth.dto.ConsentDTO;
import com.team25.telehealth.dto.DoctorDTO;
import com.team25.telehealth.dto.request.ConsentRequest;
import com.team25.telehealth.entity.Consent;
import com.team25.telehealth.entity.Doctor;
import com.team25.telehealth.entity.Hospital;
import com.team25.telehealth.entity.Patient;
import com.team25.telehealth.helpers.OtpHelper;
import com.team25.telehealth.helpers.exceptions.ResourceNotFoundException;
import com.team25.telehealth.helpers.generators.ConsentIdGenerator;
import com.team25.telehealth.mappers.ConsentMapper;
import com.team25.telehealth.mappers.DoctorMapper;
import com.team25.telehealth.mappers.PatientMapper;
import com.team25.telehealth.repo.ConsentRepo;
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

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
@AllArgsConstructor
public class ConsentService {
    private final PatientMapper patientMapper;
    private final ConsentMapper consentMapper;
    private final DoctorMapper doctorMapper;
    private final ConsentRepo consentRepo;
    private final DoctorService doctorService;
    private final PatientService patientService;
    private final HospitalService hospitalService;
    private final EntityManager entityManager;
    private final ConsentIdGenerator consentIdGenerator;
    private final OtpHelper otpHelper;
    private final MailService mailService;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public ResponseEntity<?> getConsent(Principal principal, ConsentDTO consentDTO) {
        if(consentDTO.getPatientdto().getPatientId() == null || consentDTO.getPatientdto().getPatientId().isBlank()) {
            return ResponseEntity.badRequest().body("Patient details must be provided");
        }
        Patient patient = patientService.getPatientByPatientId(consentDTO.getPatientdto().getPatientId());
        if(!patientService.documentExists(patient, consentDTO.getDocumentName()))
            return ResponseEntity.badRequest().body("Couldn't find the requested document");

        Doctor requestingDoctor = doctorService.getDoctorByEmail(principal.getName());
        Doctor requestedForDoctor = null;
        Hospital hospital = null;
        if(consentDTO.getDoctorDTO() == null || consentDTO.getDoctorDTO().getDoctorId() == null
                || consentDTO.getDoctorDTO().getDoctorId().isBlank()
                || consentDTO.getDoctorDTO().getDoctorId().equals(requestingDoctor.getDoctorId())) {
            requestedForDoctor = requestingDoctor;
        } else {
            requestedForDoctor = doctorService.getDoctorByDoctorId(consentDTO.getDoctorDTO().getDoctorId());
        }
        hospital = hospitalService.findHospitalByDoctor(requestedForDoctor);
        List<Consent> l = isDuplicateConsent(hospital, requestedForDoctor, patient, consentDTO.getDocumentName());
        Consent consent = null;
        String otp = otpHelper.generateOtp();
        if(l.isEmpty()) {
            consent = Consent.builder()
                    .consentId(consentIdGenerator.generateNextId())
                    .hospital(hospital)
                    .patient(patient)
                    .doctor(requestedForDoctor)
                    .expiryDate(null)
                    .reqDoctorId(requestingDoctor.getId().toString())
                    .documentName(consentDTO.getDocumentName())
                    .otp(passwordEncoder.encode(otp))
                    .active(true)
                    .otpExpiry(otpHelper.generateExpirationTime())
                    .build();
        } else {
            consent = l.get(0);
            consent.setExpiryDate(null);
            consent.setActive(true);
            consent.setOtp(passwordEncoder.encode(otp));
            consent.setOtpExpiry(otpHelper.generateExpirationTime());
        }

        if(!consent.getReqDoctorId().equals(requestingDoctor.getId().toString())) {
            consent.setReqDoctorId(requestingDoctor.getId().toString());
        }
        String msg = "";
        if(consent.getReqDoctorId().equals(consent.getDoctor().getId().toString())) {
            msg = requestingDoctor.getFirstName() + " is asking consent to see your document " + consent.getDocumentName()
                    + ". Please go to the website and use this OTP " + otp
                    + " to provide consent. OTP will ony be valid for 10 minutes";
        } else {
            msg = requestingDoctor.getFirstName() + " is asking consent to share your document " + consent.getDocumentName()
                    + " with the doctor " + consent.getDoctor().getFirstName() + " of hospital " + hospital.getName()
                    + ". Please go to the website and use this OTP " + otp
                    + " to provide consent. OTP will ony be valid for 10 minutes";
        }
        consentRepo.save(consent);
        mailService.sendEmail(patient.getEmail(),
                "Consent to share document",
                msg
        );
        return ResponseEntity.ok("Request has been sent");
    }

    private List<Consent> isDuplicateConsent(Hospital hospital, Doctor res, Patient patient, String document) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Consent> query = cb.createQuery(Consent.class);
        Root<Consent> root = query.from(Consent.class);

        Predicate predicate = cb.and(
                cb.equal(root.get("documentName"), document),
                cb.equal(root.get("patient"), patient),
                cb.equal(root.get("doctor"), res)
        );

        query.where(predicate);
        TypedQuery<Consent> typedQuery = entityManager.createQuery(query);

        return typedQuery.getResultList();
    }

    public ResponseEntity<?> fetchAllConsentRequests(Principal principal) {
        Patient patient = patientService.getPatientByEmail(principal.getName());
        List<Consent> consents = consentRepo.findConsentsByPatientAndExpiryDate(patient, LocalDateTime.now());
        List<ConsentDTO> response = consentMapper.toDTOList(consents);
        return ResponseEntity.ok(response);
    }

    @Transactional
    public ResponseEntity<?> giveConsent(Principal principal, ConsentRequest request) {
        Patient patient = patientService.getPatientByEmail(principal.getName());
        Consent consent = consentRepo.findByConsentIdAndPatient(request.getConsentId(), patient)
                .orElseThrow(() -> new ResourceNotFoundException("Consent", "consent id", request.getConsentId()));

        if(!otpHelper.otpCheck(request.getOtp(), consent.getOtp(), consent.getOtpExpiry())) {
            return ResponseEntity.badRequest().body("OTP is expired or wrong");
        }
        switch (request.getExpiryDay()) {
            case "15" -> consent.setExpiryDate(otpHelper.generateExpirationTime(15 * 24 * 60));
            case "30" -> consent.setExpiryDate(otpHelper.generateExpirationTime(30 * 24 * 60));
            case "90" -> consent.setExpiryDate(otpHelper.generateExpirationTime(90 * 24 * 60));
            case "180" -> consent.setExpiryDate(otpHelper.generateExpirationTime(180 * 24 * 60));
            default -> {
                return ResponseEntity.badRequest().body("Expiry Day provided is wrong");
            }
        }
        consentRepo.save(consent);
        mailService.sendEmail(
                consent.getDoctor().getEmail(),
                patient.getFirstName() + " gave you access of document",
                patient.getFirstName() + " gave you access of document " + consent.getDocumentName()
                        + ". You can go to the website to access it."
                );
        return ResponseEntity.ok("Consent has been given");
    }

    public ResponseEntity<?> checkDoctorConsents(Principal principal) {
        Doctor doctor = doctorService.getDoctorByEmail(principal.getName());
        List<Consent> consents = consentRepo.findByHospitalAndExpiryDateAfter(doctor.getHospital(), LocalDateTime.now());
        List<ConsentDTO> response = consentMapper.toDTOList(consents);
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<?> fetchDocument(Principal principal, String consentId, String patientId) {
        Consent consent = consentRepo.findByConsentId(consentId)
                .orElseThrow(() -> new ResourceNotFoundException("Consent", "id", consentId));
        Doctor doctor = doctorService.getDoctorByEmail(principal.getName());
        if(!doctor.getHospital().getId().equals(consent.getHospital().getId())) {
            return ResponseEntity.badRequest().body("You do not have consent to access this document");
        }
        if(LocalDateTime.now().isAfter(consent.getExpiryDate())) {
            return ResponseEntity.badRequest().body("You need to apply again for the consent as it is expired");
        }
        Patient patient = patientService.getPatientByPatientId(patientId);
        if(!Objects.equals(patient.getId(), consent.getPatient().getId()))
            return ResponseEntity.badRequest().body("Patient Id is wrong for this consent");
        return patientService.fetchFile(patient, consent.getDocumentName());
    }

    // No point of having update function here
    public ResponseEntity<?> deleteConsent(String consentId){
        Consent consent = consentRepo.findByConsentId(consentId)
                .orElseThrow(() -> new ResourceNotFoundException("Consent", "id", consentId));

        consent.setActive(false);
        consentRepo.save(consent);
        return ResponseEntity.ok("Consent deleted Successfully");
    }
}
