package com.team25.telehealth.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "prescription")
@EntityListeners(AuditingEntityListener.class)
public class Prescription extends BaseEntity {
    @Column(name = "prescription_id", unique = true, nullable = false)
    private String prescriptionId;

    @Column(name="document_link", nullable = false)
    private String documentLink;

    @Column(name = "symptoms")
    private String symptoms;

    @Column(name="medicines_and_dosage")
    private String medicinesAndDosage;

    @Column(name = "advice")
    private String advice;

    @OneToOne
    @JoinColumn(name = "appointment_id")
    @JsonBackReference
    private Appointment appointment;
}
