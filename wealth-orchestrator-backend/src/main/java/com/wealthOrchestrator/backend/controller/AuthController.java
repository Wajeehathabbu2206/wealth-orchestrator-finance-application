package com.wealthOrchestrator.backend.controller;

import com.wealthOrchestrator.backend.dto.AuthRequest;
import com.wealthOrchestrator.backend.dto.AuthResponse;
import com.wealthOrchestrator.backend.dto.RegisterRequest;
import com.wealthOrchestrator.backend.model.User;
import com.wealthOrchestrator.backend.repository.UserRepository;
import com.wealthOrchestrator.backend.Security.JwtUtil;

import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationManager authManager;
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(AuthenticationManager authManager,
                          UserRepository userRepo,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil) {
        this.authManager = authManager;
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepo.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        if (userRepo.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("ROLE_USER");

        userRepo.save(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            String identifier = request.getIdentifier();

            Optional<User> userOpt = userRepo.findByUsername(identifier);

            if (userOpt.isEmpty()) {
                userOpt = userRepo.findByEmail(identifier);
            }

            if (userOpt.isEmpty()) {
                return ResponseEntity.status(401).body("Invalid username or email");
            }

            User user = userOpt.get();

            Authentication auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            user.getUsername(), request.getPassword()));

            String token = jwtUtil.generateToken(user.getUsername());

            return ResponseEntity.ok(new AuthResponse(
                    token, // Send raw token
                    user.getUsername()
            ));

        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(401).body("Invalid password");
        }
    }
}
