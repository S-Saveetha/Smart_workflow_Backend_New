package com.smartworkflow.backend.controller;

import com.smartworkflow.backend.entity.Task;
import com.smartworkflow.backend.entity.TaskStatus;
import com.smartworkflow.backend.service.TaskService;
import com.smartworkflow.backend.dto.TaskRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import com.smartworkflow.backend.dto.TaskSubmissionRequest;
import java.util.List;
import com.smartworkflow.backend.dto.ReviewRequest;


@RestController
@RequestMapping("/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;


    @PreAuthorize("hasRole('MANAGER')")
    @PostMapping
    public Task createTask(@RequestBody TaskRequest request) {
        return taskService.createTask(request);
    }


    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }


    @PreAuthorize("hasRole('EMPLOYEE')")
    @GetMapping("/my-tasks")
    public List<Task> getMyTasks() {
        return taskService.getTasksForLoggedInEmployee();
    }


    @PreAuthorize("hasAnyRole('EMPLOYEE','MANAGER')")
    @PutMapping("/{taskId}/status")
    public Task updateStatus(@PathVariable Long taskId,
                             @RequestParam TaskStatus status) {
        return taskService.updateTaskStatus(taskId, status);
    }

    @GetMapping("/manager")
    public List<Task> getManagerTasks() {
        return taskService.getTasksForLoggedInManager();
    }

    @PreAuthorize("hasRole('EMPLOYEE')")
    @PutMapping("/{taskId}/submit")
    public Task submitTask(@PathVariable Long taskId,
                           @RequestBody TaskSubmissionRequest request) {
        return taskService.submitTask(taskId, request.getSubmissionLink());
    }
    @PreAuthorize("hasRole('MANAGER')")
    @PutMapping("/{taskId}/review")
    public Task reviewTask(@PathVariable Long taskId,
                           @RequestBody ReviewRequest request) {
        return taskService.reviewTask(
                taskId,
                request.getStatus(),
                request.getFeedback()
        );
    }
}