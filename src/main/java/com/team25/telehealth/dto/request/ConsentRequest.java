package com.team25.telehealth.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ConsentRequest {
    @NotEmpty(message = "Consent Id cannot be empty")
    @JsonProperty("consent_id")
    private String consentId;

    @NotEmpty(message = "Expiry Day must be provided")
    @JsonProperty("expiry_day")
    private String expiryDay;

    @NotEmpty(message = "OTP cannot be empty")
    @Size(min = 6, max = 6, message = "Enter the complete OTP")
    @JsonProperty("otp")
    private String otp;
}
