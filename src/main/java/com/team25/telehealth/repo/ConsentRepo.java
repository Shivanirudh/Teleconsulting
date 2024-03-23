package com.team25.telehealth.repo;

import com.team25.telehealth.entity.Consent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ConsentRepo extends JpaRepository<Consent, Integer> {
    public Optional<Consent> findByConsentId(String consentId);
}
