package com.smartworkflow.backend.service;

import com.smartworkflow.backend.config.JwtUtil;
import com.smartworkflow.backend.dto.LoginRequest;
import com.smartworkflow.backend.dto.LoginResponse;
import com.smartworkflow.backend.dto.UserRequest;
import com.smartworkflow.backend.entity.Role;
import com.smartworkflow.backend.entity.User;
import com.smartworkflow.backend.repository.RoleRepository;
import com.smartworkflow.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // =====================================================
    // CREATE USER (Simple - without manager mapping)
    // =====================================================
    public User createUser(UserRequest request) {

        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found"));

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setActive(true);

        return userRepository.save(user);
    }

    // =====================================================
    // CREATE USER WITH MANAGER MAPPING
    // =====================================================
    public User createUserWithManager(UserRequest request) {

        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found"));

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setActive(true);

        // If Employee → assign manager
        if (role.getName().equals("ROLE_EMPLOYEE")) {

            if (request.getManagerId() == null) {
                throw new RuntimeException("Employee must have a manager");
            }

            User manager = userRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new RuntimeException("Manager not found"));

            // Safety check
            if (!manager.getRole().getName().equals("ROLE_MANAGER")) {
                throw new RuntimeException("Selected user is not a manager");
            }

            user.setManager(manager);
        }

        return userRepository.save(user);
    }
    public List<User> getEmployeesForLoggedInManager() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User manager = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Manager not found"));

        if (!manager.getRole().getName().equals("ROLE_MANAGER")) {
            throw new RuntimeException("Only MANAGER can access this");
        }

        return userRepository.findByManagerId(manager.getId());
    }


    public List<User> getEmployeesByManager(Long managerId) {

        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new RuntimeException("Manager not found"));

        return userRepository.findByManager(manager);
    }
    public List<User> getManagers() {
        return userRepository.findByRole_Name("ROLE_MANAGER");
    }

    // =====================================================
    // GET ALL USERS
    // =====================================================
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deactivateManagerAndReassign(Long managerId, Long newManagerId) {

        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new RuntimeException("Manager not found"));

        User newManager = userRepository.findById(newManagerId)
                .orElseThrow(() -> new RuntimeException("New manager not found"));

        if (!manager.getRole().getName().equals("ROLE_MANAGER") ||
                !newManager.getRole().getName().equals("ROLE_MANAGER")) {

            throw new RuntimeException("Both must be managers");
        }

        // Get employees under this manager
        List<User> employees = userRepository.findByManager(manager);

        // Reassign employees
        for (User emp : employees) {
            emp.setManager(newManager);
        }

        userRepository.saveAll(employees);

        // Now deactivate old manager
        manager.setActive(false);
        userRepository.save(manager);
    }
    // =====================================================
    // LOGIN
    // =====================================================
    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isActive()) {
            throw new RuntimeException("ACCOUNT_DEACTIVATED");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("INVALID_PASSWORD");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return new LoginResponse(
                token,
                user.getEmail(),
                user.getRole().getName()
        );
    }
}