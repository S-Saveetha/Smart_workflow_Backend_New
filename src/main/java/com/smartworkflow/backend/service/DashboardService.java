package com.smartworkflow.backend.service;

import com.smartworkflow.backend.dto.DashboardResponse;
import com.smartworkflow.backend.entity.TaskStatus;
import com.smartworkflow.backend.entity.User;
import com.smartworkflow.backend.repository.TaskRepository;
import com.smartworkflow.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    public DashboardResponse getDashboard() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String role = user.getRole().getName();

        if (role.equals("ROLE_MANAGER")) {

            long total = taskRepository.countByCreatedByManagerId(user.getId());

            return new DashboardResponse(
                    total,
                    taskRepository.countByCreatedByManagerIdAndStatus(user.getId(), TaskStatus.PENDING),
                    taskRepository.countByCreatedByManagerIdAndStatus(user.getId(), TaskStatus.IN_PROGRESS),
                    taskRepository.countByCreatedByManagerIdAndStatus(user.getId(), TaskStatus.SUBMITTED),
                    taskRepository.countByCreatedByManagerIdAndStatus(user.getId(), TaskStatus.APPROVED),
                    taskRepository.countByCreatedByManagerIdAndStatus(user.getId(), TaskStatus.REJECTED)
            );
        }

        else if (role.equals("ROLE_EMPLOYEE")) {

            long total = taskRepository.countByAssignedEmployeeId(user.getId());

            return new DashboardResponse(
                    total,
                    taskRepository.countByAssignedEmployeeIdAndStatus(user.getId(), TaskStatus.PENDING),
                    taskRepository.countByAssignedEmployeeIdAndStatus(user.getId(), TaskStatus.IN_PROGRESS),
                    taskRepository.countByAssignedEmployeeIdAndStatus(user.getId(), TaskStatus.SUBMITTED),
                    taskRepository.countByAssignedEmployeeIdAndStatus(user.getId(), TaskStatus.APPROVED),
                    taskRepository.countByAssignedEmployeeIdAndStatus(user.getId(), TaskStatus.REJECTED)
            );
        }

        else {
            throw new RuntimeException("Unauthorized role");
        }
    }
}