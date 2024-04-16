package com.team25.telehealth.helpers;

import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.CipherInputStream;
import javax.crypto.CipherOutputStream;
import javax.crypto.spec.SecretKeySpec;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Base64;

@Service
public class EncryptionService {
    private static final byte[] COMMON_KEY = "yeKterceSrepuSyM".getBytes();

    public void encryptAndStoreFile(String filePath, InputStream inputStream) throws Exception {
        try (OutputStream outputStream = new CipherOutputStream(
                new FileOutputStream(filePath),
                getEncryptCipher())) {
            byte[] buffer = new byte[1024];
            int bytesRead;
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }
        }
    }

    public byte[] decryptFile(String filePath) throws Exception {
        byte[] encryptedBytes = Files.readAllBytes(Paths.get(filePath));
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
             CipherInputStream cipherInputStream = new CipherInputStream(
                     new ByteArrayInputStream(encryptedBytes),
                     getDecryptCipher())) {
            byte[] buffer = new byte[1024];
            int bytesRead;
            while ((bytesRead = cipherInputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }
            return outputStream.toByteArray();
        }
    }

    private Cipher getEncryptCipher() throws Exception {
        SecretKeySpec secretKeySpec = new SecretKeySpec(COMMON_KEY, "AES");
        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec);
        return cipher;
    }

    private Cipher getDecryptCipher() throws Exception {
        SecretKeySpec secretKeySpec = new SecretKeySpec(COMMON_KEY, "AES");
        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.DECRYPT_MODE, secretKeySpec);
        return cipher;
    }

    public static String encrypt(String data) throws Exception {
        SecretKeySpec secretKeySpec = new SecretKeySpec(COMMON_KEY, "AES");
        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec);
        byte[] encryptedByteValue = cipher.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return Base64.getEncoder().encodeToString(encryptedByteValue);
    }

    public static String decrypt(String data) throws Exception {
        SecretKeySpec secretKeySpec = new SecretKeySpec(COMMON_KEY, "AES");
        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.DECRYPT_MODE, secretKeySpec);
        byte[] decryptedValue = Base64.getDecoder().decode(data);
        byte[] decryptedByteValue = cipher.doFinal(decryptedValue);
        return new String(decryptedByteValue, StandardCharsets.UTF_8);
    }
}
