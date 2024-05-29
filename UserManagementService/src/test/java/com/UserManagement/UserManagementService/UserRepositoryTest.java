//package com.UserManagement.UserManagementService;
//
//
//import com.UserManagement.UserManagementService.model.User;
//import com.UserManagement.UserManagementService.repository.UserRepository;
//import com.UserManagement.UserManagementService.Role;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
//import java.util.Optional;
//
//import static org.assertj.core.api.Assertions.assertThat;
//
//@DataJpaTest
//public class UserRepositoryTest {
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Test
//    public void whenFindByUsername_thenReturnUser() {
//        // given
//        User user = new User("testuser", "password", "testuser@example.com", Role.USER, null, null);
//        userRepository.save(user);
//
//        // when
//        Optional<User> found = userRepository.findByUsername(user.getUsername());
//
//        // then
//        assertThat(found.isPresent()).isTrue();
//        assertThat(found.get().getUsername()).isEqualTo(user.getUsername());
//    }
//}
