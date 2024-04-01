package com.UserManagement.UserManagementService.security.auth;

import java.time.LocalDateTime;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.security.core.userdetails.UserDetails;

import com.UserManagement.UserManagementService.repository.UserRepository;
import com.UserManagement.UserManagementService.security.JwtService;
import com.UserManagement.UserManagementService.Role;
import com.UserManagement.UserManagementService.model.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
	private final UserRepository repository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;

	private final AuthenticationManager authenticationManager;

	public AuthenticationResponse register(RegisterRequest request) {
		  var user = User.builder()
			        .username(request.getUsername())
			        .email(request.getEmail())
			        .password(passwordEncoder.encode(request.getPassword()))
			        .role(Role.USER)
			        .createdAt(LocalDateTime.now()) // Set the current date and time here
	                .lastModified(LocalDateTime.now())
			        .build();
		repository.save(user);
		var jwtToken = jwtService.generateToken(user);

		  return AuthenticationResponse.builder()
	                .token(jwtToken)
	                .userId(user.getId()) // Set user ID in response
	                .build();	}

	   public AuthenticationResponse authenticate(AuthenticationRequest request) {
	        authenticationManager.authenticate(
	                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
	        User user = repository.findByUsername(request.getUsername())
	                .orElseThrow(() -> new IllegalStateException("User not found"));
	        String jwtToken = jwtService.generateToken(user);

	        return AuthenticationResponse.builder()
	                .token(jwtToken)
	                .userId(user.getId()) // Include the user ID in the response
	                .build();
	    }
}