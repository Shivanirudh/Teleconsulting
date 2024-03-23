package com.team25.telehealth.mappers;

import com.team25.telehealth.dto.ConsentDTO;
import com.team25.telehealth.entity.Consent;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ConsentMapper {
    ConsentMapper INSTANCE = Mappers.getMapper(ConsentMapper.class);

    ConsentDTO toDTO(Consent consent);

    Consent toEntity(ConsentDTO consentDTO);
}
