package com.team25.telehealth.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.team25.telehealth.model.Role;
import com.team25.telehealth.model.Specialization;
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
@Table(name = "doctor")
@EntityListeners(AuditingEntityListener.class)
public class Doctor extends BaseEntity{
    @Column(name = "doctor_id", unique = true, nullable = false)
    private String doctorId;

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

    @Column(name="specialization")
    @Enumerated(EnumType.STRING)
    private Specialization specialization;

    @ManyToOne
    @JoinColumn(name = "hospital_id", nullable = false)
    @JsonManagedReference
    private Hospital hospital;

    @OneToMany(mappedBy = "doctor")
    @JsonBackReference
    private List<Schedule> schedules;

    @OneToMany(mappedBy = "doctor")
    @JsonBackReference
    private List<Appointment> appointments;

    @OneToMany(mappedBy = "doctor")
    @JsonBackReference
    private List<Consent> consents;

    @Override
    public String toString() {
        return "Doctor{" +
                "doctorId='" + doctorId + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", phoneNo=" + phoneNo +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", role=" + role +
                ", otp='" + otp + '\'' +
                ", otpExpiry=" + otpExpiry +
                ", specialization=" + specialization +
                '}';
    }
}
