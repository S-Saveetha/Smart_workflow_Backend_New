package com.smartworkflow.backend.dto;

public class DashboardResponse {

    private long totalTasks;
    private long pending;
    private long inProgress;
    private long submitted;
    private long approved;
    private long rejected;

    public DashboardResponse(long totalTasks,
                             long pending,
                             long inProgress,
                             long submitted,
                             long approved,
                             long rejected) {
        this.totalTasks = totalTasks;
        this.pending = pending;
        this.inProgress = inProgress;
        this.submitted = submitted;
        this.approved = approved;
        this.rejected = rejected;
    }

    public long getTotalTasks() { return totalTasks; }
    public long getPending() { return pending; }
    public long getInProgress() { return inProgress; }
    public long getSubmitted() { return submitted; }
    public long getApproved() { return approved; }
    public long getRejected() { return rejected; }
}