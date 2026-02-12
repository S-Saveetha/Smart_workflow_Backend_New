package com.smartworkflow.backend.controller;

import com.smartworkflow.backend.entity.User;
import com.smartworkflow.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.smartworkflow.backend.dto.UserRequest;
import com.smartworkflow.backend.dto.LoginRequest;
import com.smartworkflow.backend.dto.LoginResponse;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return userService.login(request);
    }

    @PostMapping
    public User createUser(@RequestBody UserRequest request) {
        return userService.createUser(request);
    }

    @GetMapping
    public List<User> getUsers() {
        return userService.getAllUsers();
    }
}
