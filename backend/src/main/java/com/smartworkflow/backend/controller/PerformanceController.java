package com.smartworkflow.backend.controller;

import com.smartworkflow.backend.service.PerformanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.smartworkflow.backend.dto.PerformanceResponse;
import java.util.List;

@RestController
@RequestMapping("/performance")
public class PerformanceController {

    @Autowired
    private PerformanceService performanceService;

    // ADMIN: get all employees performance
    @GetMapping
    public List<PerformanceResponse> getAllPerformance() {
        return performanceService.getAllPerformanceReports();
    }

    // Single employee performance (optional)
    @GetMapping("/{employeeId}")
    public PerformanceResponse getPerformance(@PathVariable Long employeeId) {
        return performanceService.getPerformanceReport(employeeId);
    }
}
