package com.smartworkflow.backend.service;

import com.smartworkflow.backend.entity.Task;
import com.smartworkflow.backend.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.smartworkflow.backend.dto.TaskRequest;
import com.smartworkflow.backend.entity.User;
import com.smartworkflow.backend.entity.TaskStatus;
import com.smartworkflow.backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.List;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Task createTask(TaskRequest request) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User manager = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Manager not found"));

        if (!manager.getRole().getName().equals("ROLE_MANAGER")) {
            throw new RuntimeException("Only MANAGER can create tasks");
        }

        User employee = userRepository.findById(request.getAssignedEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        if (!employee.getRole().getName().equals("ROLE_EMPLOYEE")) {
            throw new RuntimeException("Task can only be assigned to EMPLOYEE");
        }

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDeadline(request.getDeadline());
        task.setStatus(TaskStatus.PENDING);
        task.setAssignedEmployee(employee);
        task.setCreatedByManager(manager);

        return taskRepository.save(task);
    }

    public Task updateTaskStatus(Long taskId, TaskStatus newStatus) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String role = user.getRole().getName();

        // EMPLOYEE LOGIC
        if (role.equals("ROLE_EMPLOYEE")) {

            if (!task.getAssignedEmployee().getId().equals(user.getId())) {
                throw new RuntimeException("You can only update your own tasks");
            }

            if (newStatus == TaskStatus.IN_PROGRESS &&
                    task.getStatus() == TaskStatus.PENDING) {
                task.setStatus(newStatus);
            }
            else if (newStatus == TaskStatus.SUBMITTED &&
                    task.getStatus() == TaskStatus.IN_PROGRESS) {
                task.setStatus(newStatus);
            }
            else {
                throw new RuntimeException("Invalid status transition for EMPLOYEE");
            }
        }

        // MANAGER LOGIC
        else if (role.equals("ROLE_MANAGER")) {

            if (newStatus == TaskStatus.APPROVED &&
                    task.getStatus() == TaskStatus.SUBMITTED) {
                task.setStatus(newStatus);
            }
            else if (newStatus == TaskStatus.REJECTED &&
                    task.getStatus() == TaskStatus.SUBMITTED) {
                task.setStatus(newStatus);
            }
            else {
                throw new RuntimeException("Invalid status transition for MANAGER");
            }
        }

        else {
            throw new RuntimeException("Unauthorized role");
        }

        return taskRepository.save(task);
    }

    public List<Task> getTasksForLoggedInEmployee() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User employee = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!employee.getRole().getName().equals("ROLE_EMPLOYEE")) {
            throw new RuntimeException("Only EMPLOYEE can view their tasks");
        }

        return taskRepository.findByAssignedEmployeeId(employee.getId());
    }
}