package com.team25.telehealth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentDTO {
    @JsonProperty("appointment_id")
    private String appointmentId;

    @NotNull(message = "Slot timing must be present")
    @JsonProperty("slot")
    private LocalDateTime slot;

    @JsonProperty("meeting_link")
    private String meetingLink;

    @JsonProperty("prescription")
    private PrescriptionDTO prescription;

    @JsonProperty("patient_id")
    private PatientDTO patient;

    @JsonProperty("doctor_id")
    private DoctorDTO doctor;
}
