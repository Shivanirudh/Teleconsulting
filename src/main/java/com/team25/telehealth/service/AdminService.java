package com.team25.telehealth.service;

import com.team25.telehealth.dto.AdminDTO;
import com.team25.telehealth.entity.Admin;
import com.team25.telehealth.mappers.AdminMapper;
import com.team25.telehealth.mappers.AdminMapperImpl;
import com.team25.telehealth.repo.AdminRepo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AdminService {
    public final AdminRepo adminRepo;
    public final AdminMapper adminMapper = new AdminMapperImpl();
    public final DoctorService doctorService;

    public AdminDTO addAdmin(Admin admin) {
        return adminMapper.toDTO(adminRepo.save(admin));
    }

    public Admin getAdminByEmail(String email) {
        if (email == null || email.isEmpty()) return null;
        return adminRepo.findByEmail(email).orElse(null);
    }
}
