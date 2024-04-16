package com.team25.telehealth.repo;

import com.team25.telehealth.entity.Consent;
import com.team25.telehealth.entity.Doctor;
import com.team25.telehealth.entity.Hospital;
import com.team25.telehealth.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ConsentRepo extends JpaRepository<Consent, Integer> {
    public Optional<Consent> findByConsentId(String consentId);

    public Optional<Consent> findByConsentIdAndPatient(String id, Patient patient);

    @Query("SELECT c FROM Consent c WHERE c.patient = :patient AND (c.expiryDate IS NULL OR c.expiryDate < :currentTime)")
    List<Consent> findConsentsByPatientAndExpiryDate(@Param("patient") Patient patient, @Param("currentTime") LocalDateTime currentTime);

    List<Consent> findByHospitalAndExpiryDateAfter(Hospital hospital, LocalDateTime localDateTime);

    List<Consent> findAllByPatientAndDocumentName(Patient patient, String documentName);
}
