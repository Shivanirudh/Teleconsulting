package com.team25.telehealth.mappers;

import com.team25.telehealth.dto.DoctorDTO;
import com.team25.telehealth.entity.Doctor;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface DoctorMapper {
    DoctorMapper INSTANCE = Mappers.getMapper(DoctorMapper.class);

    DoctorDTO toDTO(Doctor doctor);

    @Mapping(source = "email", target = "email")
    Doctor toEntity(DoctorDTO doctorDTO);
}
