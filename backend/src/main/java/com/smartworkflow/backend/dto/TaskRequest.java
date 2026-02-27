package com.smartworkflow.backend.dto;

import java.time.LocalDate;

public class TaskRequest {

    private String title;
    private String description;
    private LocalDate deadline;
    private String priority;   // 🔥 NEW
    private Long assignedEmployeeId;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public Long getAssignedEmployeeId() { return assignedEmployeeId; }
    public void setAssignedEmployeeId(Long assignedEmployeeId) {
        this.assignedEmployeeId = assignedEmployeeId;
    }
}