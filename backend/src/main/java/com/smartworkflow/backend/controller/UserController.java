package com.smartworkflow.backend.controller;

import com.smartworkflow.backend.dto.LoginRequest;
import com.smartworkflow.backend.dto.LoginResponse;
import com.smartworkflow.backend.dto.UserRequest;
import com.smartworkflow.backend.entity.User;
import com.smartworkflow.backend.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin
public class UserController {

    @Autowired
    private UserService userService;

    // ================= REGISTER USER =================
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody UserRequest request) {
        return ResponseEntity.ok(userService.createUser(request));
    }

    @GetMapping("/manager/{id}/employees")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getEmployeesByManager(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getEmployeesByManager(id));
    }

    // ================= LOGIN =================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            LoginResponse response = userService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/deactivate-manager")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deactivateManager(
            @RequestParam Long managerId,
            @RequestParam Long newManagerId) {

        userService.deactivateManagerAndReassign(managerId, newManagerId);

        return ResponseEntity.ok("Manager deactivated and employees reassigned");
    }

    // ================= GET ALL USERS =================
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
}