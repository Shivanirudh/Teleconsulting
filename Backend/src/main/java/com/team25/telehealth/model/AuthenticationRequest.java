package com.team25.telehealth.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationRequest {
    @NotNull
    @JsonProperty("email")
    private String email;

    @NotNull
    @JsonProperty("otp")
    private String otp;

    @NotNull
    @JsonProperty("password")
    private String password;
}
