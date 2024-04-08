package com.team25.telehealthcronjob.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "consent")
@EntityListeners(AuditingEntityListener.class)
public class Consent extends BaseEntity {
    @Column(name = "consent_id", unique = true, nullable = false)
    private String consentId;

    @Column(name="document_name", nullable = false)
    private String documentName;

    @Column(name="expiry_date", nullable = true)
    private LocalDateTime expiryDate;

    @Column(name = "otp")
    private String otp;

    @Column(name="otp_expiry")
    private LocalDateTime otpExpiry;

    // When requesting for consent we give two options 1 is self and 2 is other hospital
    // if it is self, req_doctor_id and hospital id should be of the requesting doctor
    // but in other case it will be doctor and hospital we are requesting for.
    @Column(name="req_doctor_id", nullable = false)
    private String reqDoctorId;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonManagedReference
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    @JsonManagedReference
    private Doctor doctor;

    @ManyToOne
    @JoinColumn(name = "hospital_id", nullable = false)
    @JsonManagedReference
    private Hospital hospital;
}
