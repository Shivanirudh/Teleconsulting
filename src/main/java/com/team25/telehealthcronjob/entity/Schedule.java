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
@Table(name = "schedule")
@EntityListeners(AuditingEntityListener.class)
public class Schedule extends BaseEntity {
    @Column(name = "schedule_id", unique = true, nullable = false)
    private String scheduleId;

    @Column(name="slot", nullable = false)
    private LocalDateTime slot;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    @JsonManagedReference
    private Doctor doctor;
}
