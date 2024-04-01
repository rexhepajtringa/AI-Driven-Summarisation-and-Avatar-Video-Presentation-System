package com.UserManagement.UserManagementService.repository;

import com.UserManagement.UserManagementService.model.User;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findByUsername(String username);

}
