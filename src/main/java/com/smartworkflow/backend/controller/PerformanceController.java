package com.smartworkflow.backend.controller;

import com.smartworkflow.backend.service.PerformanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/performance")
public class PerformanceController {

    @Autowired
    private PerformanceService performanceService;

    @GetMapping("/{employeeId}")
    public double getPerformance(@PathVariable Long employeeId) {
        return performanceService.calculatePerformance(employeeId);
    }
}
