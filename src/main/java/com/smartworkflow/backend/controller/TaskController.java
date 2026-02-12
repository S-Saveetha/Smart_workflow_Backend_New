package com.smartworkflow.backend.controller;

import com.smartworkflow.backend.entity.Task;
import com.smartworkflow.backend.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.smartworkflow.backend.dto.TaskRequest;
import com.smartworkflow.backend.entity.TaskStatus;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

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

    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }
    @PreAuthorize("hasRole('EMPLOYEE')")
    @PutMapping("/{taskId}/status")
    public Task updateStatus(@PathVariable Long taskId,
                             @RequestParam TaskStatus status) {
        return taskService.updateTaskStatus(taskId, status);
    }


}
