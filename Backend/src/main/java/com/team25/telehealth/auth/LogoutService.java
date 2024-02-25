package com.team25.telehealth.auth;

import com.team25.telehealth.repo.TokenRepo;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LogoutService implements LogoutHandler {
    private final TokenRepo tokenRepo;
    private final String TOKEN_PREFIX = "Bearer ";
    private final String AUTH_HEADER = "Authorization";
    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        final String authHeader = request.getHeader(AUTH_HEADER);
        final String jwt;
        final String userEmail;

        if(authHeader == null || !authHeader.startsWith(TOKEN_PREFIX)) {
            return;
        }
        jwt = authHeader.substring(TOKEN_PREFIX.length());
        var storedToken = tokenRepo.findByToken(jwt).orElse(null);

        if(storedToken != null) {
            storedToken.setExpired(true);
            storedToken.setRevoked(true);

            tokenRepo.save(storedToken);
        }
    }
}
