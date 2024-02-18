package com.team25.telehealth.helpers;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class OtpHelper {

    private static final Random RANDOM = new Random();
    private static final int OTP_NUMBER_DIGITS = 6;
    private static final int OTP_EXPIRATION_MINUTES = 10;

    public String generateOtp() {
        int otp = 100000 + RANDOM.nextInt(900000);
        return Integer.toString(otp);
    }

    public LocalDateTime generateExpirationTime() {
        return LocalDateTime.now().plusMinutes(OTP_EXPIRATION_MINUTES);
    }

    public boolean isOtpExpired(LocalDateTime expirationTime) {
        return LocalDateTime.now().isAfter(expirationTime);
    }
}
