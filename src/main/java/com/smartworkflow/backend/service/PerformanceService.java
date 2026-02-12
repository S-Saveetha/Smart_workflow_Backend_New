package com.smartworkflow.backend.service;

import com.smartworkflow.backend.dto.PerformanceResponse;
import com.smartworkflow.backend.entity.TaskStatus;
import com.smartworkflow.backend.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PerformanceService {

    @Autowired
    private TaskRepository taskRepository;

    public PerformanceResponse getPerformanceReport(Long employeeId) {

        long totalTasks = taskRepository.countByAssignedEmployeeId(employeeId);

        long completedTasks = taskRepository
                .countByAssignedEmployeeIdAndStatus(employeeId, TaskStatus.COMPLETED);

        long pendingTasks = totalTasks - completedTasks;

        double percentage = totalTasks == 0 ? 0 :
                ((double) completedTasks / totalTasks) * 100;

        return new PerformanceResponse(totalTasks, completedTasks,
                pendingTasks, percentage);
    }
}
