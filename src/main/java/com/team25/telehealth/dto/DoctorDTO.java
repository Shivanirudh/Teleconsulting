package com.team25.telehealth.dto;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.team25.telehealth.entity.Hospital;
import com.team25.telehealth.model.Role;
import com.team25.telehealth.model.Specialization;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorDTO {
    @JsonProperty("doctor_id")
    private String doctorId;

    @NotEmpty(message = "First Name cannot be empty")
    @JsonProperty("first_name")
    private String firstName;

    @JsonProperty("last_name")
    private String lastName;

    @NotNull(message = "Phone Number Cannot be empty")
    @Digits(integer = 10, message = "Enter correct phone number", fraction = 0)
    @JsonProperty("phone_number")
    private Long phoneNo;

    @NotEmpty(message = "Email cannot be empty")
    @Email(message = "Email is not valid", regexp = "^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$")
    @JsonProperty("email")
    private String email;

    @Size(min = 4, max = 255, message = "Atleast 4 characters are required")
    @JsonProperty("password")
    private String password;

    @JsonProperty("role")
    @Enumerated(EnumType.STRING)
    private Role role;

    @JsonProperty("specialization")
    @Enumerated(EnumType.STRING)
    private Specialization specialization;

    @NotNull(message = "Hospital information is required")
    @JsonProperty("hospital")
    private HospitalDTO hospital;
}
