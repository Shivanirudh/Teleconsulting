package com.team25.telehealth.config;

import com.team25.telehealth.entity.Admin;
import com.team25.telehealth.entity.Doctor;
import com.team25.telehealth.entity.Patient;
import com.team25.telehealth.model.User;
import com.team25.telehealth.repo.AdminRepo;
import com.team25.telehealth.repo.DoctorRepo;
import com.team25.telehealth.repo.PatientRepo;
import com.team25.telehealth.service.AdminService;
import com.team25.telehealth.service.DoctorService;
import com.team25.telehealth.service.PatientService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final PatientRepo patientRepo;
    private final DoctorRepo doctorRepo;
    private final AdminRepo adminRepo;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Patient patient = patientRepo.findByEmail(username).orElse(null);
        if(patient != null) return new User(patient);

        Doctor doctor = doctorRepo.findByEmail(username).orElse(null);
        if(doctor != null) return new User(doctor);

        Admin admin = adminRepo.findByEmail(username).orElse(null);
        if(admin != null) return new User(admin);

        throw new UsernameNotFoundException("User with username " + username + " not found");
    }
}
