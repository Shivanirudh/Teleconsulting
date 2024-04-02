package com.team25.telehealth.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.team25.telehealth.dto.PatientDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PatientRegistrationDTO {
    @NotNull(message = "Patient Details must be provided")
    @Valid
    @JsonProperty("patient")
    private PatientDTO patientDTO;

    @NotEmpty(message = "Otp must be provided")
    @Size(min = 6, max = 6, message = "OTP must be of 6 digits")
    @JsonProperty("otp")
    private String otp;
}
