package com.team25.telehealth.helpers;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.stereotype.Component;

@Component
public class SecretKeys {
    public static final String AES_ENCRYPTION_KEY = Dotenv.load().get("AES_ENCRYPTION_KEY");
    public static final String JWT_KEY = Dotenv.load().get("JWT_SECRET_KEY");
}
