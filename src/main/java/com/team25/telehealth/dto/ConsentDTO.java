package com.team25.telehealth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.team25.telehealth.entity.Hospital;
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
public class ConsentDTO {
    @JsonProperty("consent_id")
    private String consentId;

    @NotEmpty(message = "Document name must be present")
    @JsonProperty("document_name")
    private String documentName;

//    @JsonProperty("expiry_date")
//    private String expiryDate;

    // When requesting for consent we give two options 1 is self and 2 is other hospital
    // if it is self, req_doctor_id and hospital id should be of the requesting doctor
    // but in other case it will be doctor and hospital we are requesting for.
//    @JsonProperty("req_doctor_id")
//    private String reqDoctorId;

    @JsonProperty("patient_id")
    @NotNull(message = "Patient must be provided")
    private PatientDTO patientdto;

    @JsonProperty("doctor_id")
    private DoctorDTO doctorDTO;

    @JsonProperty("hospital_id")
    private HospitalDTO hospital;
}
