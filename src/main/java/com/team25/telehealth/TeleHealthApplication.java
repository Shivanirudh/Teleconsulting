package com.team25.telehealth;

import com.team25.telehealth.entity.Admin;
import com.team25.telehealth.entity.Doctor;
import com.team25.telehealth.entity.Patient;
import com.team25.telehealth.service.AdminService;
import com.team25.telehealth.service.DoctorService;
import com.team25.telehealth.service.PatientService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
public class TeleHealthApplication {

    public static void main(String[] args) {
        SpringApplication.run(TeleHealthApplication.class, args);
    }

    @Bean
    public CommandLineRunner commandLineRunner(PatientService patientService, DoctorService doctorService, AdminService adminService) {
        return  args -> {
            adminService.addAdmin(Admin.builder()
                            .firstName("admin")
                            .lastName("admin")
                            .phoneNo(9711877902L)
                            .password("admin")
                            .email("admin@gmail.com")
                    .build());
            patientService.addPatient(Patient.builder()
                    .firstName("prashant")
                    .lastName("jain")
                    .phoneNo(9810231647L)
                    .password("1234")
                    .email("pj@gmail.com")
                    .build());
            doctorService.addDoctor(Doctor.builder()
                    .firstName("Yash")
                    .lastName("Jain")
                    .phoneNo(9953123857L)
                    .password("1234")
                    .email("yj@gmail.com")
                    .build());

            System.out.println(adminService.getAdminByEmail("admin@gmail.com"));
            System.out.println(patientService.getPatientByEmail("pj@gmail.com"));
            System.out.println(doctorService.getDoctorByEmail("yj@gmail.com"));
        };
    }
}
