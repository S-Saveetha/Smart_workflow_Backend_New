package com.smartworkflow.backend.controller;

import com.smartworkflow.backend.dto.DashboardResponse;
import com.smartworkflow.backend.entity.Task;
import com.smartworkflow.backend.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/manager")
    public DashboardResponse managerDashboard() {
        return dashboardService.getManagerDashboard();
    }
    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE','ADMIN')")
    @GetMapping
    public DashboardResponse getDashboard() {
        return dashboardService.getDashboardData();
    }

    @GetMapping("/recent")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Task> getRecentTasks() {
        return dashboardService.getRecentTasks();
    }
}