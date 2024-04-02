package com.team25.telehealth.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Validate {
    @Id
    @Column(name = "email")
    private String email;

    @Column(name = "otp")
    private String otp;

    @Column(name="otp_expiry")
    private LocalDateTime otpExpiry;
}
