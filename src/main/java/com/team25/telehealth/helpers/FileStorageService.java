package com.team25.telehealth.helpers;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FileStorageService {
    public void storeFile(String folderPath, MultipartFile file) throws Exception {
        File folder = new File(folderPath);
        if (!folder.exists()) {
            folder.mkdirs();
        }

        try (InputStream inputStream = file.getInputStream();
             OutputStream outputStream = new FileOutputStream(new File(folder, file.getOriginalFilename()))) {
            byte[] buffer = new byte[1024];
            int bytesRead;
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }
        }
    }

    public File getFile(String filePath) {
        return new File(filePath);
    }

    public List<String> getAllFileNames(String folderPath) {
        File folder = new File(folderPath);
        File[] files = folder.listFiles();
        if (files != null) {
            return Arrays.stream(files)
                    .filter(File::isFile)
                    .map(File::getName)
                    .collect(Collectors.toList());
        } else {
            return new ArrayList<>();
        }
    }
}