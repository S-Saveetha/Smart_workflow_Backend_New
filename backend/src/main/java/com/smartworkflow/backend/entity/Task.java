package com.smartworkflow.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 1000)
    private String description;

    private LocalDate deadline;

    @Enumerated(EnumType.STRING)
    private TaskStatus status = TaskStatus.PENDING;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    @ManyToOne
    @JoinColumn(name = "assigned_employee_id")
    private User assignedEmployee;

    @ManyToOne
    @JoinColumn(name = "created_by_manager_id")
    private User createdByManager;

    private String submissionLink;

    @Column(length = 2000)
    private String managerFeedback;

    public String getSubmissionLink() {
        return submissionLink;
    }

    public void setSubmissionLink(String submissionLink) {
        this.submissionLink = submissionLink;
    }

    public String getManagerFeedback() {
        return managerFeedback;
    }

    public void setManagerFeedback(String managerFeedback) {
        this.managerFeedback = managerFeedback;
    }
    // ================= Getters & Setters =================

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }

    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }

    public void setDescription(String description) { this.description = description; }

    public LocalDate getDeadline() { return deadline; }

    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }

    public TaskStatus getStatus() { return status; }

    public void setStatus(TaskStatus status) { this.status = status; }

    public Priority getPriority() { return priority; }

    public void setPriority(Priority priority) { this.priority = priority; }

    public User getAssignedEmployee() { return assignedEmployee; }

    public void setAssignedEmployee(User assignedEmployee) { this.assignedEmployee = assignedEmployee; }

    public User getCreatedByManager() { return createdByManager; }

    public void setCreatedByManager(User createdByManager) { this.createdByManager = createdByManager; }
}