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

    private double completionRate;
    public void setTotalTasks(long totalTasks) {
        this.totalTasks = totalTasks;
    }

    public void setPending(long pending) {
        this.pending = pending;
    }

    public void setInProgress(long inProgress) {
        this.inProgress = inProgress;
    }

    public void setSubmitted(long submitted) {
        this.submitted = submitted;
    }

    public void setApproved(long approved) {
        this.approved = approved;
    }

    public void setRejected(long rejected) {
        this.rejected = rejected;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public void setTotalManagers(long totalManagers) {
        this.totalManagers = totalManagers;
    }

    public void setTotalEmployees(long totalEmployees) {
        this.totalEmployees = totalEmployees;
    }

    public void setActiveUsers(long activeUsers) {
        this.activeUsers = activeUsers;
    }

    public void setInactiveUsers(long inactiveUsers) {
        this.inactiveUsers = inactiveUsers;
    }



    public double getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(double completionRate) {
        this.completionRate = completionRate;
    }
    public DashboardResponse() {
    }
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