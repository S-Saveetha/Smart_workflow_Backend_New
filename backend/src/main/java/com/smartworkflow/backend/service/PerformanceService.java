package com.smartworkflow.backend.service;

import com.smartworkflow.backend.dto.PerformanceResponse;
import com.smartworkflow.backend.entity.TaskStatus;
import com.smartworkflow.backend.entity.User;
import com.smartworkflow.backend.repository.TaskRepository;
import com.smartworkflow.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PerformanceService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    // 🔹 Single employee performance (used by /performance/{id})
    public PerformanceResponse getPerformanceReport(Long employeeId) {

        User user = userRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        long totalTasks = taskRepository.countByAssignedEmployeeId(employeeId);

        long completedTasks = taskRepository
                .countByAssignedEmployeeIdAndStatus(employeeId, TaskStatus.APPROVED);

        long pendingTasks = totalTasks - completedTasks;

        double percentage = totalTasks == 0 ? 0 :
                ((double) completedTasks / totalTasks) * 100;

        return new PerformanceResponse(
                user.getId(),
                user.getName(),
                totalTasks,
                completedTasks,
                pendingTasks,
                percentage
        );
    }

    // 🔹 Admin: All employees performance
    public List<PerformanceResponse> getAllPerformanceReports() {

        List<User> employees = userRepository.findAll()
                .stream()
                .filter(user -> user.getRole().getName().equals("ROLE_EMPLOYEE"))
                .toList();

        return employees.stream()
                .map(user -> getPerformanceReport(user.getId()))
                .toList();
    }
}