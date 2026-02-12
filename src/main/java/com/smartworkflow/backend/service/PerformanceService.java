package com.smartworkflow.backend.service;

import com.smartworkflow.backend.entity.TaskStatus;
import com.smartworkflow.backend.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PerformanceService {

    @Autowired
    private TaskRepository taskRepository;

    public double calculatePerformance(Long employeeId) {

        long totalTasks = taskRepository.countByAssignedEmployeeId(employeeId);

        long completedTasks = taskRepository
                .countByAssignedEmployeeIdAndStatus(employeeId, TaskStatus.COMPLETED);

        if (totalTasks == 0) return 0;

        return ((double) completedTasks / totalTasks) * 100;
    }
}
