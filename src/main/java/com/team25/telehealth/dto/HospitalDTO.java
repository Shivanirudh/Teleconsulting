package com.team25.telehealth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HospitalDTO {
    @JsonProperty("hospital_id")
    private String hospitalId;

    @NotEmpty(message = "Hospital Name cannot be empty")
    @JsonProperty("name")
    private String name;

    @NotEmpty(message = "Hospital address cannot be empty")
    @JsonProperty("address")
    private String address;

    @NotNull(message = "Phone Number Cannot be empty")
    @Digits(integer = 10, message = "Enter correct phone number", fraction = 0)
    @JsonProperty("phone_number")
    private Long phoneNo;

    @NotEmpty(message = "Email cannot be empty")
    @Email(message = "Email is not valid", regexp = "^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$")
    @JsonProperty("email")
    private String email;
}
