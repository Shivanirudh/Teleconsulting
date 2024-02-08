package com.team25.telehealth.mappers;

import com.team25.telehealth.dto.PatientDTO;
import com.team25.telehealth.entity.Patient;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface PatientMapper {
    PatientMapper INSTANCE = Mappers.getMapper(PatientMapper.class);

    PatientDTO toDTO(Patient patient);

    Patient toEntity(PatientDTO patientDTO);
}
