package com.smartworkflow.backend.controller;

import com.smartworkflow.backend.entity.Task;
import com.smartworkflow.backend.entity.TaskStatus;
import com.smartworkflow.backend.service.TaskService;
import com.smartworkflow.backend.dto.TaskRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    // ✅ Manager creates task
    @PreAuthorize("hasRole('MANAGER')")
    @PostMapping
    public Task createTask(@RequestBody TaskRequest request) {
        return taskService.createTask(request);
    }

    // ✅ Manager can view all tasks
    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    // ✅ Employee can view only their tasks
    @PreAuthorize("hasRole('EMPLOYEE')")
    @GetMapping("/my-tasks")
    public List<Task> getMyTasks() {
        return taskService.getTasksForLoggedInEmployee();
    }

    // ✅ BOTH Employee & Manager can update status
    @PreAuthorize("hasAnyRole('EMPLOYEE','MANAGER')")
    @PutMapping("/{taskId}/status")
    public Task updateStatus(@PathVariable Long taskId,
                             @RequestParam TaskStatus status) {
        return taskService.updateTaskStatus(taskId, status);
    }
}