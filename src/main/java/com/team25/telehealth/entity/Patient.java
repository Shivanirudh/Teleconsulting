package com.team25.telehealth.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.team25.telehealth.model.BloodGroup;
import com.team25.telehealth.model.Gender;
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
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "patient")
@EntityListeners(AuditingEntityListener.class)
public class Patient extends BaseEntity{
    @Column(name = "patient_id", unique = true, nullable = false)
    private String patientId;

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

    @Column(name = "age", nullable = false)
    private Integer age;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(name = "dob", nullable = false)
    private LocalDateTime DOB;

    @Column(name = "height")
    private Integer height;

    @Column(name = "weight")
    private Float weight;

    @Column(name = "blood_type")
    @Enumerated(EnumType.STRING)
    private BloodGroup bloodType;

    @OneToMany(mappedBy = "patient")
    @JsonBackReference
    private List<Appointment> appointment;

    @OneToMany(mappedBy = "patient")
    @JsonBackReference
    private List<Consent> consents;

    @Override
    public String toString() {
        return "Patient{" +
                "patientId='" + patientId + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", phoneNo=" + phoneNo +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", role=" + role +
                ", otp='" + otp + '\'' +
                ", otpExpiry=" + otpExpiry +
                ", age=" + age +
                ", gender=" + gender +
                ", DOB=" + DOB +
                ", height=" + height +
                ", weight=" + weight +
                ", bloodType=" + bloodType +
                '}';
    }
}
