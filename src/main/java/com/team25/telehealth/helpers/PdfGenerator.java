package com.team25.telehealth.helpers;


import com.team25.telehealth.dto.request.PrescriptionRequest;
import com.team25.telehealth.entity.Doctor;
import com.team25.telehealth.entity.Patient;
import lombok.AllArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;

@Service
@AllArgsConstructor
public class PdfGenerator {
    private final String STORAGE_PATH = "D:\\Prashant Jain\\MTech\\Semester 2\\HAD\\Project\\Appointment_Data\\";
    private final EncryptionService encryptionService;

    public String loadPrescriptionTemplate() throws IOException {
        ClassPathResource resource = new ClassPathResource("prescription_template.html");
        try (InputStream inputStream = resource.getInputStream()) {
            byte[] bytes = inputStream.readAllBytes();
            return new String(bytes, StandardCharsets.UTF_8);
        }
    }

    public void generatePrescriptionPdfFromHTML(Patient patient, Doctor doctor, PrescriptionRequest prescription, String fileName) throws IOException {

        String outputPath = STORAGE_PATH + fileName + ".pdf";
        Path path = Paths.get(STORAGE_PATH);
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }

        // Read HTML template
        String htmlContent = loadPrescriptionTemplate();

        // Populate HTML template with data
        htmlContent = htmlContent.replace("${hospitalName}", doctor.getHospital().getName() != null ? doctor.getHospital().getName() : "")
                .replace("${hospitalAddress}", doctor.getHospital().getAddress() != null ? doctor.getHospital().getAddress() : "")
                .replace("${patientId}", patient.getPatientId() != null ? patient.getPatientId() : "")
                .replace("${patientName}", patient.getFirstName() + " " + patient.getLastName())
                .replace("${patientEmail}", patient.getEmail() != null ? patient.getEmail() : "")
                .replace("${patientAge}", String.valueOf(patient.getAge()))
                .replace("${patientGender}", patient.getGender() != null ? patient.getGender().toString(): "")
                .replace("${patientBloodType}", patient.getBloodType().getValue() != null ? patient.getBloodType().getValue() : "")
                .replace("${doctorName}", doctor.getFirstName() + " " + doctor.getLastName())
                .replace("${doctorSpecialization}", doctor.getSpecialization() != null ? doctor.getSpecialization().toString() : "")
                .replace("${symptoms}", prescription.getSymptoms() != null ? prescription.getSymptoms() : "")
                .replace("${medicinesAndDosage}", prescription.getMedicinesAndDosage() != null ? prescription.getMedicinesAndDosage() : "")
                .replace("${advice}", prescription.getAdvice() != null ? prescription.getAdvice() : "")
                .replace("${uploadDate}", LocalDateTime.now().toLocalDate() + " " + LocalDateTime.now().toLocalTime());

        // Convert HTML to PDF
        ITextRenderer renderer = new ITextRenderer();
        renderer.setDocumentFromString(htmlContent);
        renderer.layout();
        try (FileOutputStream outputStream = new FileOutputStream(outputPath)) {
            renderer.createPDF(outputStream);
        }

        // Encryption of the PDF
//        try (FileInputStream inputStream = new FileInputStream(outputPath)) {
//            encryptionService.encryptAndStoreFile(outputPath, inputStream);
//        } catch (Exception e) {
//            throw new RuntimeException(e);
//        }
    }
}
