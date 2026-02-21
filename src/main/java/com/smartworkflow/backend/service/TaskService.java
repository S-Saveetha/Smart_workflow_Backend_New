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

    public Task saveTask(Task task) {
        return taskRepository.save(task);
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }


    public Task createTask(TaskRequest request) {

        // Get logged-in user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User manager = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Manager not found"));

        // ✅ Ensure only MANAGER can create tasks
        if (!manager.getRole().getName().equals("ROLE_MANAGER")) {
            throw new RuntimeException("Only MANAGER can create tasks");
        }

        User employee = userRepository.findById(request.getAssignedEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        // ✅ Ensure task is assigned only to EMPLOYEE
        if (!employee.getRole().getName().equals("ROLE_EMPLOYEE")) {
            throw new RuntimeException("Task can only be assigned to an EMPLOYEE");
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
    public Task updateTaskStatus(Long taskId, TaskStatus status) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setStatus(status);

        return taskRepository.save(task);
    }

}
