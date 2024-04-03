package com.team25.telehealth.helpers;


import com.team25.telehealth.dto.request.PrescriptionRequest;
import com.team25.telehealth.entity.Doctor;
import com.team25.telehealth.entity.Patient;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;

@Service
public class PdfGenerator {
    public void generatePrescriptionPdf(Patient patient, Doctor doctor, PrescriptionRequest prescription, String fileName) throws IOException {
        String STORAGE_PATH = "D:\\Prashant Jain\\MTech\\Semester 2\\HAD\\Project\\Appointment_Data\\";
        String outputPath = STORAGE_PATH + fileName + ".pdf";
        Path path = Paths.get(STORAGE_PATH);
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                contentStream.beginText();
                contentStream.setFont(PDType1Font.TIMES_ROMAN, 12);
                float yPosition = 700; // Initial Y position

                contentStream.setFont(PDType1Font.TIMES_BOLD, 16); // Set font to bold for headings
                String websiteName = "TeleHealth Consultation";
                float textWidth = PDType1Font.TIMES_BOLD.getStringWidth(websiteName) / 1000f * 16; // Calculate the width of the text
                float startX = (page.getMediaBox().getWidth() - textWidth) / 2; // Calculate the starting X position to center the text
                contentStream.newLineAtOffset(startX, yPosition);
                contentStream.showText(websiteName);
                contentStream.newLineAtOffset(0, -15);
                contentStream.setFont(PDType1Font.TIMES_BOLD, 12); // Set font back to normal for details
                contentStream.showText("Hospital Name:");
                contentStream.setFont(PDType1Font.TIMES_ROMAN, 12);
                contentStream.showText("    " + doctor.getHospital().getName());
                contentStream.newLineAtOffset(0, -15);
                contentStream.setFont(PDType1Font.TIMES_BOLD, 12);
                contentStream.showText("Hospital Address:");
                contentStream.setFont(PDType1Font.TIMES_ROMAN, 12);
                contentStream.showText("    " + doctor.getHospital().getAddress());
                contentStream.endText();

                // Draw line to separate sections
                contentStream.moveTo(100, yPosition - 125);
                contentStream.lineTo(500, yPosition - 125);
                contentStream.stroke();

                // Patient details
                contentStream.beginText();
                contentStream.newLineAtOffset(100, yPosition - 145); // Adjust Y position relative to the initial Y position
                contentStream.setFont(PDType1Font.TIMES_BOLD, 12); // Set font back to normal for details
                contentStream.showText("Patient Details:");
                contentStream.newLineAtOffset(0, -15);
                contentStream.setFont(PDType1Font.TIMES_BOLD, 12);
                contentStream.showText("ID:");
                contentStream.setFont(PDType1Font.TIMES_ROMAN, 12);
                contentStream.showText("    " + patient.getPatientId());
                contentStream.newLineAtOffset(0, -15);
                contentStream.setFont(PDType1Font.TIMES_BOLD, 12); // Set font to bold for headings
                contentStream.showText("Name:");
                contentStream.setFont(PDType1Font.TIMES_ROMAN, 12); // Set font back to normal for values
                contentStream.showText("    " + patient.getFirstName() + " " + patient.getLastName());
                contentStream.newLineAtOffset(0, -15);
                contentStream.setFont(PDType1Font.TIMES_BOLD, 12); // Set font to bold for headings
                contentStream.showText("Email:");
                contentStream.setFont(PDType1Font.TIMES_ROMAN, 12); // Set font back to normal for values
                contentStream.showText("    " + patient.getEmail());
                contentStream.newLineAtOffset(0, -15);
                contentStream.setFont(PDType1Font.TIMES_BOLD, 12); // Set font to bold for headings
                contentStream.showText("Age:");
                contentStream.setFont(PDType1Font.TIMES_ROMAN, 12); // Set font back to normal for values
                contentStream.showText("    " + patient.getAge());
                contentStream.showText("        ");
                contentStream.setFont(PDType1Font.TIMES_BOLD, 12); // Set font to bold for gender heading
                contentStream.showText("Gender:");
                contentStream.setFont(PDType1Font.TIMES_ROMAN, 12); // Set font back to normal for values
                contentStream.showText("    " + patient.getGender());
                contentStream.showText("        ");
                contentStream.setFont(PDType1Font.TIMES_BOLD, 12); // Set font to bold for blood type heading
                contentStream.showText("Blood Type:");
                contentStream.setFont(PDType1Font.TIMES_ROMAN, 12); // Set font back to normal for values
                contentStream.showText("    " + patient.getBloodType().getValue());
                contentStream.newLine();
                contentStream.endText();

                // Draw line to separate sections
                contentStream.moveTo(100, yPosition - 225); // Adjust the Y position for the next line
                contentStream.lineTo(500, yPosition - 225);
                contentStream.stroke();

                // Doctor details
                yPosition -= 240; // Move down
                contentStream.setFont(PDType1Font.TIMES_BOLD, 12); // Set font to bold for headings
                contentStream.beginText();
                contentStream.newLineAtOffset(100, yPosition);
                contentStream.showText("Doctor Details:");
                contentStream.setFont(PDType1Font.TIMES_BOLD, 12); // Set font back to normal for details
                contentStream.newLineAtOffset(0, -15);
                contentStream.showText("Name:");
                contentStream.setFont(PDType1Font.TIMES_ROMAN, 12);
                contentStream.showText("    " + doctor.getFirstName() + " " + doctor.getLastName());
                contentStream.newLineAtOffset(0, -15);
                contentStream.setFont(PDType1Font.TIMES_BOLD, 12); // Set font to bold for headings
                contentStream.showText("Specialization:");
                contentStream.setFont(PDType1Font.TIMES_ITALIC, 12); // Set font back to normal for values
                contentStream.showText("    " + doctor.getSpecialization());
                contentStream.newLineAtOffset(0, -15);
                contentStream.endText();

                // Draw line to separate sections
                contentStream.moveTo(100, yPosition - 60);
                contentStream.lineTo(500, yPosition - 60);
                contentStream.stroke();

                // Prescription details
                yPosition -= 80; // Move down
                contentStream.setFont(PDType1Font.TIMES_BOLD, 12); // Set font to bold for headings
                contentStream.beginText();
                contentStream.newLineAtOffset(100, yPosition);
                contentStream.showText("Prescription Details:");
                contentStream.setFont(PDType1Font.TIMES_ROMAN, 12); // Set font back to normal for details
                contentStream.newLineAtOffset(0, -15);
                contentStream.setFont(PDType1Font.TIMES_BOLD, 12); // Set font to bold for headings
                contentStream.showText("Symptoms:");
                contentStream.setFont(PDType1Font.TIMES_ROMAN, 12); // Set font back to normal for values
                contentStream.showText("    " + prescription.getSymptoms());
                contentStream.newLineAtOffset(0, -15);
                contentStream.setFont(PDType1Font.TIMES_BOLD, 12); // Set font to bold for headings
                contentStream.showText("Medicines and Dosage:");
                contentStream.setFont(PDType1Font.TIMES_ROMAN, 12); // Set font back to normal for values
                contentStream.showText("    " + prescription.getMedicinesAndDosage());
                contentStream.newLineAtOffset(0, -15);
                contentStream.setFont(PDType1Font.TIMES_BOLD, 12); // Set font to bold for headings
                contentStream.showText("Advice:");
                contentStream.setFont(PDType1Font.TIMES_ROMAN, 12); // Set font back to normal for values
                contentStream.showText("    " + prescription.getAdvice());
                contentStream.newLineAtOffset(0, -15);
                contentStream.setFont(PDType1Font.TIMES_BOLD, 12); // Set font to bold for headings
                contentStream.showText("Prescription Upload Date:");
                contentStream.setFont(PDType1Font.TIMES_ROMAN, 12); // Set font back to normal for values
                contentStream.showText("    " + LocalDateTime.now().toLocalDate() + " " + LocalDateTime.now().toLocalTime());
                contentStream.newLine();
                contentStream.endText();
            }
            document.save(outputPath);
        }
    }

    public String loadPrescriptionTemplate() throws IOException {
        ClassPathResource resource = new ClassPathResource("prescription_template.html");
        try (InputStream inputStream = resource.getInputStream()) {
            byte[] bytes = inputStream.readAllBytes();
            return new String(bytes, StandardCharsets.UTF_8);
        }
    }

    public void generatePrescriptionPdfFromHTML(Patient patient, Doctor doctor, PrescriptionRequest prescription, String fileName) throws IOException {
        String STORAGE_PATH = "D:\\Prashant Jain\\MTech\\Semester 2\\HAD\\Project\\Appointment_Data\\";
        String outputPath = STORAGE_PATH + fileName + ".pdf";
        Path path = Paths.get(STORAGE_PATH);
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }

        // Read HTML template
        String htmlContent = loadPrescriptionTemplate();

        htmlContent = htmlContent.replace("\r", "");
        // Replace newline characters with an empty string or a space
        htmlContent = htmlContent.replace("\n", "");

        // Populate HTML template with data
        htmlContent = htmlContent.replace("${hospitalName}", doctor.getHospital().getName())
                .replace("${hospitalAddress}", doctor.getHospital().getAddress())
                .replace("${patientId}", patient.getPatientId())
                .replace("${patientName}", patient.getFirstName() + " " + patient.getLastName())
                .replace("${patientEmail}", patient.getEmail())
                .replace("${patientAge}", String.valueOf(patient.getAge()))
                .replace("${patientBloodType}", patient.getBloodType().getValue())
                .replace("${doctorName}", doctor.getFirstName() + " " + doctor.getLastName())
                .replace("${doctorSpecialization}", doctor.getSpecialization().toString())
                .replace("${symptoms}", prescription.getSymptoms())
                .replace("${medicinesAndDosage}", prescription.getMedicinesAndDosage())
                .replace("${advice}", prescription.getAdvice())
                .replace("${uploadDate}", LocalDateTime.now().toString());

        // Convert HTML to PDF
        ITextRenderer renderer = new ITextRenderer();
        renderer.setDocumentFromString(htmlContent);
        renderer.layout();
        try (FileOutputStream outputStream = new FileOutputStream(outputPath)) {
            renderer.createPDF(outputStream);
        }
    }
}
