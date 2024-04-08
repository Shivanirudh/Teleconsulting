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

/*
    FOR APPOINTMENT CLASS ACTIVE FIELD MEANS THAT WHETHER THAT APPOINTMENT IS CANCELLED OR NOT
    IF IT IS TRUE THEN IT MEANS IT IS NOT CANCELLED
    IF IT IS FALSE THEN IT MEANS IT IS CANCELLED.
 */

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "appointment")
@EntityListeners(AuditingEntityListener.class)
public class Appointment extends BaseEntity {

    @Column(name = "appointment_id", unique = true, nullable = false)
    private String appointmentId;

    @Column(name="slot", nullable = false)
    private LocalDateTime slot;

    @Column(name="meeting_link", nullable = false)
    private String meetingLink;

    @Column(name="patient_joined")
    private Boolean patientJoined;

    @Column(name="doctor_joined")
    private Boolean doctorJoined;

    @OneToOne(mappedBy = "appointment")
    @JsonManagedReference
    private Prescription prescription;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonManagedReference
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    @JsonManagedReference
    private Doctor doctor;
}
