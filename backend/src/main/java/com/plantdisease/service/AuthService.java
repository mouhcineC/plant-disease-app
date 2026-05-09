package com.plantdisease.service;

import com.plantdisease.dto.AuthResponse;
import com.plantdisease.dto.LoginRequest;
import com.plantdisease.dto.RegisterRequest;
import com.plantdisease.entity.User;
import com.plantdisease.exception.CustomException;
import com.plantdisease.repository.UserRepository;
import com.plantdisease.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new CustomException("Email is already in use");
        }
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();
        userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse(
                 token,
                "User registered successfully"
        );
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new CustomException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new CustomException("Invalid email or password");
        }
        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(
                token,
                "User logged in successfully"
        );
    }
}
