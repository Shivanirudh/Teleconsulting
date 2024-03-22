package com.team25.telehealth;

import com.team25.telehealth.dto.DoctorDTO;
import com.team25.telehealth.dto.HospitalDTO;
import com.team25.telehealth.entity.Admin;
import com.team25.telehealth.entity.Doctor;
import com.team25.telehealth.entity.Hospital;
import com.team25.telehealth.entity.Patient;
import com.team25.telehealth.model.BloodGroup;
import com.team25.telehealth.model.Role;
import com.team25.telehealth.model.Specialization;
import com.team25.telehealth.service.AdminService;
import com.team25.telehealth.service.DoctorService;
import com.team25.telehealth.service.HospitalService;
import com.team25.telehealth.service.PatientService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import java.time.LocalDateTime;

@SpringBootApplication
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
public class TeleHealthApplication {

    public static void main(String[] args) {
        SpringApplication.run(TeleHealthApplication.class, args);
    }

//    @Bean
    public CommandLineRunner commandLineRunner(PatientService patientService, DoctorService doctorService, AdminService adminService, HospitalService hospitalService) {
        return  args -> {
            adminService.addAdmin(Admin.builder()
                    .firstName("admin")
                    .lastName("")
                    .phoneNo(9711877902L)
                    .password("admin")
                    .email("team25telehealth@gmail.com")
                    .build());
            patientService.addPatient(Patient.builder()
                    .firstName("prashant")
                    .lastName("jain")
                    .phoneNo(9810231647L)
                    .password("1234")
                    .email("me.prashantjn@gmail.com")
                    .age(22)
                    .DOB(LocalDateTime.now())
                    .bloodType(BloodGroup.A_POSITIVE)
                    .build());
            adminService.addHospital(null, HospitalDTO.builder()
                    .name("Team25")
                    .address("somewhere in india")
                    .phoneNo(1234567890L)
                    .email("team25telehealth@gmail.com")
                    .build());
            Hospital hospital = hospitalService.getHospitalByEmail("team25telehealth@gmail.com");
            doctorService.addDoctor(null, DoctorDTO.builder()
                    .firstName("Yash")
                    .lastName("Jain")
                    .phoneNo(9953123857L)
                    .role(Role.SENIORDOCTOR)
                    .specialization(Specialization.GYNECOLOGIST)
                    .email("prashantjain0501@gmail.com")
                    .build(), hospital);

            System.out.println(adminService.getAdminByEmail("team25telehealth@gmail.com"));
            System.out.println(patientService.getPatientByEmail("me.prashantjn@gmail.com"));
            System.out.println(doctorService.getDoctorByEmail("prashantjain0501@gmail.com"));
        };
    }
}
