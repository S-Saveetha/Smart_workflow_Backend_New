package com.smartworkflow.backend.controller;

import com.smartworkflow.backend.entity.Role;
import com.smartworkflow.backend.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/roles")
public class RoleController {

    @Autowired
    private RoleService roleService;

    @PostMapping
    public Role createRole(@RequestBody Role role) {
        return roleService.saveRole(role);
    }

    @GetMapping
    public List<Role> getRoles() {
        return roleService.getAllRoles();
    }
}
