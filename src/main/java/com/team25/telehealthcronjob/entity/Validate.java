package com.team25.telehealthcronjob.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
