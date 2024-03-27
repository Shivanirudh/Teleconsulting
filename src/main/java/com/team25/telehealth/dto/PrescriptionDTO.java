package com.team25.telehealth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionDTO {
    @JsonProperty("prescription_id")
    private String prescriptionId;

    @JsonProperty("document_link")
    private String documentLink;
}
