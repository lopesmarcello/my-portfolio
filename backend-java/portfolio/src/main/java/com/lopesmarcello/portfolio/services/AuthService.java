package com.lopesmarcello.portfolio.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.lopesmarcello.portfolio.security.JwtService;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtService jwtService;

    @Value("${admin.username}")
    private String adminUsername;

    @Value("${admin.password}")
    private String adminPassword;

    @PostConstruct
    public void logAdminUsername() {
        if ("admin".equals(adminUsername)) {
            log.warn("Admin credentials are using default values. Set ADMIN_USERNAME and ADMIN_PASSWORD env vars for production use.");
        } else {
            log.info("Admin username loaded: {}", adminUsername);
        }
    }

    /**
     * Validates credentials against the configured admin username/password.
     * Returns a JWT token on success, or null if credentials are invalid.
     */
    public String login(String username, String password) {
        if (adminUsername.equals(username) && adminPassword.equals(password)) {
            return jwtService.generateToken(username);
        }
        return null;
    }
}
