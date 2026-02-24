package com.lopesmarcello.portfolio.services;

import com.lopesmarcello.portfolio.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtService jwtService;

    @Value("${admin.username}")
    private String adminUsername;

    @Value("${admin.password}")
    private String adminPassword;

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
