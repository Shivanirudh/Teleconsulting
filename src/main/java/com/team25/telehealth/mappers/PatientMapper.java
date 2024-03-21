package com.team25.telehealth.mappers;

import com.team25.telehealth.dto.PatientDTO;
import com.team25.telehealth.entity.Patient;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface PatientMapper {
    PatientMapper INSTANCE = Mappers.getMapper(PatientMapper.class);

    PatientDTO toDTO(Patient patient);

    @Mapping(target = "password", source = "password")
    Patient toEntity(PatientDTO patientDTO);
}
