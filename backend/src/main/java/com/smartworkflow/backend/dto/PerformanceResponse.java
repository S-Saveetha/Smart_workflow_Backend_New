package com.smartworkflow.backend.dto;

public class PerformanceResponse {

    private Long employeeId;
    private String name;

    private long totalTasks;
    private long completedTasks;
    private long pendingTasks;
    private double performancePercentage;

    public PerformanceResponse(Long employeeId,
                               String name,
                               long totalTasks,
                               long completedTasks,
                               long pendingTasks,
                               double performancePercentage) {
        this.employeeId = employeeId;
        this.name = name;
        this.totalTasks = totalTasks;
        this.completedTasks = completedTasks;
        this.pendingTasks = pendingTasks;
        this.performancePercentage = performancePercentage;
    }

    public Long getEmployeeId() { return employeeId; }
    public String getName() { return name; }
    public long getTotalTasks() { return totalTasks; }
    public long getCompletedTasks() { return completedTasks; }
    public long getPendingTasks() { return pendingTasks; }
    public double getPerformancePercentage() { return performancePercentage; }
}