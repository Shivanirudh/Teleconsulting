package com.team25.telehealth.mappers;

import com.team25.telehealth.dto.AdminDTO;
import com.team25.telehealth.entity.Admin;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface AdminMapper {
    AdminMapper INSTANCE = Mappers.getMapper(AdminMapper.class);

    AdminDTO toDTO(Admin admin);

    Admin toEntity(AdminDTO adminDTO);
}
