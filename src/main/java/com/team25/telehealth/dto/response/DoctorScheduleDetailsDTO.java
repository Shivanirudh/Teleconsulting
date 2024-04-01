package com.team25.telehealth.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.team25.telehealth.dto.AppointmentDTO;
import com.team25.telehealth.entity.Appointment;
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
public class DoctorScheduleDetailsDTO {
    @JsonProperty("slots")
    private LocalDateTime[] slots;

    @JsonProperty("appointments")
    private AppointmentDTO[] appointments;
}
