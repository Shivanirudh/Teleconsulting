package com.team25.telehealth.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.team25.telehealth.model.Specialization;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DoctorSearchLDTO {
    @NotEmpty(message = "Email cannot be empty")
    @Email(message = "Email is not valid", regexp = "^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$")
    @JsonProperty("email")
    private String email;

    @JsonProperty("specialization")
    private Specialization specialization;
}
