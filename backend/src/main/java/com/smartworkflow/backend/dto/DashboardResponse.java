package com.smartworkflow.backend.dto;

public class DashboardResponse {

    // Task Stats
    private long totalTasks;
    private long pending;
    private long inProgress;
    private long submitted;
    private long approved;
    private long rejected;

    // User Stats
    private long totalUsers;
    private long totalManagers;
    private long totalEmployees;
    private long activeUsers;
    private long inactiveUsers;

    public DashboardResponse(
            long totalTasks,
            long pending,
            long inProgress,
            long submitted,
            long approved,
            long rejected,
            long totalUsers,
            long totalManagers,
            long totalEmployees,
            long activeUsers,
            long inactiveUsers
    ) {
        this.totalTasks = totalTasks;
        this.pending = pending;
        this.inProgress = inProgress;
        this.submitted = submitted;
        this.approved = approved;
        this.rejected = rejected;
        this.totalUsers = totalUsers;
        this.totalManagers = totalManagers;
        this.totalEmployees = totalEmployees;
        this.activeUsers = activeUsers;
        this.inactiveUsers = inactiveUsers;
    }

    // Getters
    public long getTotalTasks() { return totalTasks; }
    public long getPending() { return pending; }
    public long getInProgress() { return inProgress; }
    public long getSubmitted() { return submitted; }
    public long getApproved() { return approved; }
    public long getRejected() { return rejected; }

    public long getTotalUsers() { return totalUsers; }
    public long getTotalManagers() { return totalManagers; }
    public long getTotalEmployees() { return totalEmployees; }
    public long getActiveUsers() { return activeUsers; }
    public long getInactiveUsers() { return inactiveUsers; }
}