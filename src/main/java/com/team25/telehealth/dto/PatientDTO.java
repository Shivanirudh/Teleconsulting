package com.team25.telehealth.dto;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.team25.telehealth.entity.Appointment;
import com.team25.telehealth.entity.Consent;
import com.team25.telehealth.model.BloodGroup;
import com.team25.telehealth.model.Gender;
import com.team25.telehealth.model.Role;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientDTO {
    @JsonProperty("patient_id")
    private String patientId;

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

    @NotEmpty(message = "Password cannot be empty")
    @Size(min = 4, max = 255, message = "Atleast 4 characters are required")
    @JsonProperty("password")
    private String password;

    @NotNull(message = "Age must be provided")
    @Min(value = 1, message = "Age must be at least 1")
    @Max(value = 150, message = "Age cannot exceed 150")
    @JsonProperty("age")
    private Integer age;

    @JsonProperty("gender")
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @JsonProperty("blood_type")
    @Enumerated(EnumType.STRING)
    private BloodGroup bloodType;

    @NotNull(message = "DOB must be provided")
    @JsonProperty("dob")
    private LocalDateTime DOB;

    @JsonProperty("height")
    private Integer height;

    @JsonProperty("weight")
    private Float weight;
}
