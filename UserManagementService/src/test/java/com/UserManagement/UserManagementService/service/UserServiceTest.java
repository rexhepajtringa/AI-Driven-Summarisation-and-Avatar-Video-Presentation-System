package com.UserManagement.UserManagementService.service;

import com.UserManagement.UserManagementService.model.User;
import com.UserManagement.UserManagementService.repository.UserRepository;
import com.UserManagement.UserManagementService.service.UserService;
import com.UserManagement.UserManagementService.Role;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.util.Optional;
import java.util.List;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

public class UserServiceTest {

    @InjectMocks
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    private User user;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new User("testuser", "password", "testuser@example.com", Role.USER, LocalDateTime.now(), LocalDateTime.now());
    }

    @Test
    public void whenCreateUser_thenReturnUser() {
        when(userRepository.save(user)).thenReturn(user);

        User created = userService.createUser(user);

        assertThat(created.getUsername()).isEqualTo(user.getUsername());
        verify(userRepository, times(1)).save(user);
    }

    @Test
    public void whenGetUserById_thenReturnUser() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        Optional<User> found = userService.getUserById(1L);

        assertThat(found.isPresent()).isTrue();
        assertThat(found.get().getUsername()).isEqualTo(user.getUsername());
    }

    @Test
    public void whenUpdateUser_thenReturnUpdatedUser() {
        when(userRepository.save(user)).thenReturn(user);

        user.setEmail("newemail@example.com");
        User updated = userService.updateUser(user);

        assertThat(updated.getEmail()).isEqualTo("newemail@example.com");
        verify(userRepository, times(1)).save(user);
    }

    @Test
    public void whenDeleteUser_thenRepositoryShouldDelete() {
        userService.deleteUser(1L);
        verify(userRepository, times(1)).deleteById(1L);
    }

    @Test
    public void whenGetAllUsers_thenReturnUserList() {
        when(userRepository.findAll()).thenReturn(List.of(user));

        List<User> users = userService.getAllUsers();

        assertThat(users.size()).isEqualTo(1);
        assertThat(users.get(0).getUsername()).isEqualTo(user.getUsername());
    }
}
