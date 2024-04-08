package com.team25.telehealth.helpers;


import com.team25.telehealth.dto.request.PrescriptionRequest;
import com.team25.telehealth.entity.Doctor;
import com.team25.telehealth.entity.Patient;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PdfGenerator {
    @Value("${PRESCRIPTION_DATA_PATH}")
    private String STORAGE_PATH;
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

        try {
            // Read the file from the system
            File file = new File(outputPath);
            byte[] fileBytes = Files.readAllBytes(file.toPath());

            // Convert the file bytes to a multipart file
            MultipartFile multipartFile = new MockMultipartFile("file", file.getName(),
                    MediaType.APPLICATION_OCTET_STREAM_VALUE, fileBytes);

            // Create a ByteArrayInputStream using the file bytes
            try (InputStream inputStream = new ByteArrayInputStream(multipartFile.getBytes())) {
                // Encrypt and store the file
                encryptionService.encryptAndStoreFile(outputPath, inputStream);
            }
        } catch (IOException e) {
            // Handle file reading or conversion errors
            e.printStackTrace();
            throw new RuntimeException(e);
        } catch (Exception e) {
            // Handle other exceptions
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }
}
