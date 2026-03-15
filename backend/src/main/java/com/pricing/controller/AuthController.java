package com.pricing.controller;

import com.pricing.dto.JwtResponse;
import com.pricing.dto.LoginRequest;
import com.pricing.model.User;
import com.pricing.repository.UserRepository;
import com.pricing.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
    
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);
    
            org.springframework.security.core.userdetails.User userDetails = (org.springframework.security.core.userdetails.User) authentication
                    .getPrincipal();
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(item -> item.getAuthority())
                    .collect(Collectors.toList());
    
            User user = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("Error: User authenticated but not found in database."));
    
            return ResponseEntity.ok(new JwtResponse(jwt, user.getId(), user.getEmail(), roles));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Error: " + e.getMessage());
        }
    }

    @Autowired
    com.pricing.repository.CompanyRepository companyRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody com.pricing.dto.RegisterRequest signUpRequest) {
        if (userRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        // 1. Create Company
        com.pricing.model.Company company = new com.pricing.model.Company(
                signUpRequest.getCompanyName(),
                signUpRequest.getRegistrationNumber(),
                signUpRequest.getIndustry(),
                signUpRequest.getHeadquarters()
        );
        company = companyRepository.save(company);

        // 2. Create User linked to Company (Initial registrant is ADMIN)
        User user = new User(
                signUpRequest.getName(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()),
                "ADMIN",
                company
        );

        userRepository.save(user);
        return ResponseEntity.ok("Company and Admin User registered successfully!");
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
        
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        
        return ResponseEntity.ok(user);
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateCurrentUser(@RequestBody com.pricing.dto.RegisterRequest updateRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
        
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        // Update User Details
        if (updateRequest.getName() != null && !updateRequest.getName().isEmpty()) {
            user.setName(updateRequest.getName());
        }

        // Update Company Details
        com.pricing.model.Company company = user.getCompany();
        if (company != null) {
            if (updateRequest.getCompanyName() != null && !updateRequest.getCompanyName().isEmpty()) {
                company.setName(updateRequest.getCompanyName());
            }
            if (updateRequest.getRegistrationNumber() != null && !updateRequest.getRegistrationNumber().isEmpty()) {
                company.setRegistrationNumber(updateRequest.getRegistrationNumber());
            }
            companyRepository.save(company);
        }
        
        userRepository.save(user);
        return ResponseEntity.ok(user);
    }
}
