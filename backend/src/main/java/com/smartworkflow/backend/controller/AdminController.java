package com.smartworkflow.backend.controller;

import com.smartworkflow.backend.dto.UserRequest;
import com.smartworkflow.backend.entity.User;
import com.smartworkflow.backend.repository.UserRepository;
import com.smartworkflow.backend.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    // ================= GET ALL USERS =================
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ================= CREATE MANAGER / EMPLOYEE =================
    @PostMapping("/users")
    public User createUser(@RequestBody UserRequest request) {
        return userService.createUserWithManager(request);
    }

    // ================= TOGGLE USER STATUS =================
    @PutMapping("/users/{id}/toggle")
    public User toggleUserStatus(@PathVariable Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setActive(!user.isActive());

        return userRepository.save(user);
    }

    // ================= DELETE USER (OPTIONAL PROFESSIONAL FEATURE) =================
    @DeleteMapping("/users/{id}")
    public String deleteUser(@PathVariable Long id) {

        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }

        userRepository.deleteById(id);

        return "User deleted successfully";
    }
}