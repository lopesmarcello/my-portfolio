package com.lopesmarcello.portfolio;

import com.lopesmarcello.portfolio.security.JwtService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import javax.crypto.SecretKey;
import java.util.Date;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @Value("${jwt.secret}")
    private String jwtSecret;

    // POST /api/auth/login — success

    @Test
    void login_withCorrectCredentials_returns200WithToken() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"admin\",\"password\":\"admin\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty());
    }

    // POST /api/auth/login — failure

    @Test
    void login_withWrongCredentials_returns401() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"admin\",\"password\":\"wrongpassword\"}"))
                .andExpect(status().isUnauthorized());
    }

    // GET /api/auth/me — valid token

    @Test
    void me_withValidToken_returns200WithUsername() throws Exception {
        String token = jwtService.generateToken("admin");

        mockMvc.perform(get("/api/auth/me")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("admin"));
    }

    // GET /api/auth/me — no token

    @Test
    void me_withNoToken_returns401() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());
    }

    // GET /api/auth/me — expired / invalid token

    @Test
    void me_withExpiredToken_returns401() throws Exception {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        String expiredToken = Jwts.builder()
                .subject("admin")
                .issuedAt(new Date(System.currentTimeMillis() - 10_000))
                .expiration(new Date(System.currentTimeMillis() - 5_000))
                .signWith(key)
                .compact();

        mockMvc.perform(get("/api/auth/me")
                .header("Authorization", "Bearer " + expiredToken))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void me_withInvalidToken_returns401() throws Exception {
        mockMvc.perform(get("/api/auth/me")
                .header("Authorization", "Bearer not.a.valid.jwt.token"))
                .andExpect(status().isUnauthorized());
    }
}
