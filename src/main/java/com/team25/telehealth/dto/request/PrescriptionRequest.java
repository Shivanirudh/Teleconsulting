package com.team25.telehealth.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionRequest {

    @JsonProperty("appointment_id")
    private String appointmentId;

    @JsonProperty("symptoms")
    private String symptoms;

    @JsonProperty("medicines_and_dosage")
    private String medicinesAndDosage;

    @JsonProperty("advice")
    private String advice;

    @JsonProperty("upload_time")
    private LocalDateTime prescriptionUploadDate;
}
