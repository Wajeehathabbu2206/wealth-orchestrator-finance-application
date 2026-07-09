package com.wealthOrchestrator.backend.controller;

import com.wealthOrchestrator.backend.dto.AuthRequest;
import com.wealthOrchestrator.backend.dto.AuthResponse;
import com.wealthOrchestrator.backend.dto.RegisterRequest;
import com.wealthOrchestrator.backend.model.User;
import com.wealthOrchestrator.backend.repository.UserRepository;
import com.wealthOrchestrator.backend.Security.JwtUtil;
import com.wealthOrchestrator.backend.service.EmailService;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.UUID;

import com.wealthOrchestrator.backend.dto.ForgotPasswordRequestDTO;
import com.wealthOrchestrator.backend.dto.ResetPasswordRequestDTO;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
	
    private final AuthenticationManager authManager;
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;
    @Value("${app.frontend-url}")
    private String frontendUrl;

    public AuthController(AuthenticationManager authManager,
                          UserRepository userRepo,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil, EmailService emailService) {
        this.authManager = authManager;
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.emailService = emailService;
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
    
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @RequestBody ForgotPasswordRequestDTO request) {

    	try {
        Optional<User> userOptional = userRepo.findByEmail(request.getEmail());

        // Always return the same response for security
        if (userOptional.isEmpty()) {
            return ResponseEntity.ok(
                    "If an account with that email exists, a reset link has been sent."
            );
        }

        User user = userOptional.get();

        // Generate a secure random token
        String token = UUID.randomUUID().toString();

        // Save token and expiry
        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(30));

        userRepo.save(user);
      

        String resetLink =
                frontendUrl +"/reset-password?token=" + token;

        String body =
                "Hello " + user.getUsername() + ",\n\n"
                + "Make sure, you set a strong password \n"
                + "Click the link below to reset your password:\n\n"
                + resetLink
                + "\n\nThis link will expire in 30 minutes.";

        emailService.sendEmail(
                user.getEmail(),
                "Reset Your Wealth Orchestrator Password",
                body
        );
        
        return ResponseEntity.ok("If an account with that email exists, a reset link has been sent.");
        }
        catch (Exception e) {

            return ResponseEntity.internalServerError()
                    .body("Something went wrong. Please try again later.");
        }
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody ResetPasswordRequestDTO request) {

        Optional<User> userOptional =
                userRepo.findByResetToken(request.getToken());

        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("Invalid reset token.");
        }

        User user = userOptional.get();

        // Check token expiry
        if (user.getResetTokenExpiry() == null ||
        	    user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {

            user.setResetToken(null);
            user.setResetTokenExpiry(null);

            userRepo.save(user);

            return ResponseEntity.badRequest()
                    .body("Reset link has expired.");
        }

        // Encode and save new password
        user.setPassword(
                passwordEncoder.encode(request.getNewPassword())
        );

        // Clear token after successful reset
        user.setResetToken(null);
        user.setResetTokenExpiry(null);

        userRepo.save(user);

        return ResponseEntity.ok("Password reset successfully.");
    }
}
