package com.team25.telehealth.mappers;

import com.team25.telehealth.dto.AppointmentDTO;
import com.team25.telehealth.entity.Appointment;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AppointmentMapper {
    AppointmentMapper INSTANCE = Mappers.getMapper(AppointmentMapper.class);

    AppointmentDTO toDTO(Appointment appointment);

    Appointment toEntity(AppointmentDTO appointmentDTO);

    List<AppointmentDTO> toDTOList(List<Appointment> appointments);
}
