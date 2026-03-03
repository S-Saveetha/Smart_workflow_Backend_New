package com.smartworkflow.backend.service;

import com.smartworkflow.backend.dto.DashboardResponse;
import com.smartworkflow.backend.entity.Task;
import com.smartworkflow.backend.entity.TaskStatus;
import com.smartworkflow.backend.entity.User;
import com.smartworkflow.backend.repository.TaskRepository;
import com.smartworkflow.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    public DashboardResponse getManagerDashboard() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User manager = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!manager.getRole().getName().equals("ROLE_MANAGER")) {
            throw new RuntimeException("Only MANAGER allowed");
        }

        List<Task> tasks = taskRepository.findByCreatedByManager(manager);

        long total = tasks.size();
        long pending = tasks.stream().filter(t -> t.getStatus() == TaskStatus.PENDING).count();
        long inProgress = tasks.stream().filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS).count();
        long submitted = tasks.stream().filter(t -> t.getStatus() == TaskStatus.SUBMITTED).count();
        long approved = tasks.stream().filter(t -> t.getStatus() == TaskStatus.APPROVED).count();
        long rejected = tasks.stream().filter(t -> t.getStatus() == TaskStatus.REJECTED).count();

        double completionRate = total == 0 ? 0 : ((double) approved / total) * 100;

        DashboardResponse response = new DashboardResponse();
        response.setTotalTasks(total);
        response.setPending(pending);
        response.setInProgress(inProgress);
        response.setSubmitted(submitted);
        response.setApproved(approved);
        response.setRejected(rejected);
        response.setCompletionRate(completionRate);

        return response;
    }
    public List<Task> getRecentTasks() {
        return taskRepository.findTop5ByOrderByIdDesc();
    }
    public DashboardResponse getDashboardData() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String role = user.getRole().getName();

        long totalTasks = 0;
        long pending = 0;
        long inProgress = 0;
        long submitted = 0;
        long approved = 0;
        long rejected = 0;

        // 👇 Initialize user stats safely
        long totalUsers = 0;
        long totalManagers = 0;
        long totalEmployees = 0;
        long activeUsers = 0;
        long inactiveUsers = 0;

        if (role.equals("ROLE_MANAGER")) {

            totalTasks = taskRepository.countByCreatedByManagerId(user.getId());
            pending = taskRepository.countByCreatedByManagerIdAndStatus(user.getId(), TaskStatus.PENDING);
            inProgress = taskRepository.countByCreatedByManagerIdAndStatus(user.getId(), TaskStatus.IN_PROGRESS);
            submitted = taskRepository.countByCreatedByManagerIdAndStatus(user.getId(), TaskStatus.SUBMITTED);
            approved = taskRepository.countByCreatedByManagerIdAndStatus(user.getId(), TaskStatus.APPROVED);
            rejected = taskRepository.countByCreatedByManagerIdAndStatus(user.getId(), TaskStatus.REJECTED);

        }
        else if (role.equals("ROLE_EMPLOYEE")) {

            totalTasks = taskRepository.countByAssignedEmployeeId(user.getId());
            pending = taskRepository.countByAssignedEmployeeIdAndStatus(user.getId(), TaskStatus.PENDING);
            inProgress = taskRepository.countByAssignedEmployeeIdAndStatus(user.getId(), TaskStatus.IN_PROGRESS);
            submitted = taskRepository.countByAssignedEmployeeIdAndStatus(user.getId(), TaskStatus.SUBMITTED);
            approved = taskRepository.countByAssignedEmployeeIdAndStatus(user.getId(), TaskStatus.APPROVED);
            rejected = taskRepository.countByAssignedEmployeeIdAndStatus(user.getId(), TaskStatus.REJECTED);

        }
        else if (role.equals("ROLE_ADMIN")) {

            totalTasks = taskRepository.count();
            pending = taskRepository.countByStatus(TaskStatus.PENDING);
            inProgress = taskRepository.countByStatus(TaskStatus.IN_PROGRESS);
            submitted = taskRepository.countByStatus(TaskStatus.SUBMITTED);
            approved = taskRepository.countByStatus(TaskStatus.APPROVED);
            rejected = taskRepository.countByStatus(TaskStatus.REJECTED);

            totalUsers = userRepository.count();
            totalManagers = userRepository.countByRole_Name("ROLE_MANAGER");
            totalEmployees = userRepository.countByRole_Name("ROLE_EMPLOYEE");
            activeUsers = userRepository.countByActive(true);
            inactiveUsers = userRepository.countByActive(false);
        }
        else {
            throw new RuntimeException("Unauthorized role");
        }

        return new DashboardResponse(
                totalTasks,
                pending,
                inProgress,
                submitted,
                approved,
                rejected,
                totalUsers,
                totalManagers,
                totalEmployees,
                activeUsers,
                inactiveUsers
        );
    }
}