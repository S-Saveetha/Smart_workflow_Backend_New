package com.smartworkflow.backend.dto;

public class PerformanceResponse {

    private long totalTasks;
    private long completedTasks;
    private long pendingTasks;
    private double performancePercentage;

    public PerformanceResponse(long totalTasks, long completedTasks,
                               long pendingTasks, double performancePercentage) {
        this.totalTasks = totalTasks;
        this.completedTasks = completedTasks;
        this.pendingTasks = pendingTasks;
        this.performancePercentage = performancePercentage;
    }

    public long getTotalTasks() { return totalTasks; }
    public long getCompletedTasks() { return completedTasks; }
    public long getPendingTasks() { return pendingTasks; }
    public double getPerformancePercentage() { return performancePercentage; }
}
