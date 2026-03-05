package com.smartworkflow.backend.repository;

import com.smartworkflow.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    long countByRole_Name(String roleName);
    long countByActive(boolean active);
    Optional<User> findByEmail(String email);
    List<User> findByManager(User manager);
    List<User> findByRole_Name(String roleName);
    List<User> findByManagerId(Long managerId);
    
}
