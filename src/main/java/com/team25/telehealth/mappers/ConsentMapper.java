package com.team25.telehealth.mappers;

import com.team25.telehealth.dto.ConsentDTO;
import com.team25.telehealth.entity.Consent;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring", uses = {DoctorMapper.class, PatientMapper.class})
public interface ConsentMapper {
    ConsentMapper INSTANCE = Mappers.getMapper(ConsentMapper.class);

    @Mapping(target = "doctorDTO", source = "doctor")
    @Mapping(target = "patientdto", source = "patient")
    ConsentDTO toDTO(Consent consent);

    Consent toEntity(ConsentDTO consentDTO);

    List<ConsentDTO> toDTOList(List<Consent> consents);
}
