package com.team25.telehealth.entity;

import com.team25.telehealth.model.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "admin")
@EntityListeners(AuditingEntityListener.class)
public class Admin extends BaseEntity {
    @Column(name = "admin_id", unique = true, nullable = false)
    private String adminId;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "phone_number", unique = true, nullable = false)
    private Long phoneNo;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "otp")
    private String otp;

    @Column(name="otp_expiry")
    private LocalDateTime otpExpiry;
}
