package com.team25.telehealth.mappers;

import com.team25.telehealth.dto.HospitalDTO;
import com.team25.telehealth.entity.Hospital;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface HospitalMapper {
    HospitalMapper INSTANCE = Mappers.getMapper(HospitalMapper.class);

    HospitalDTO toDTO(Hospital hospital);

    Hospital toEntity(HospitalDTO hospitalDTO);
}
