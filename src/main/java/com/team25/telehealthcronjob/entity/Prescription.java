package com.team25.telehealthcronjob.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
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

    @OneToOne
    @JoinColumn(name = "appointment_id")
    @JsonBackReference
    private Appointment appointment;
}
