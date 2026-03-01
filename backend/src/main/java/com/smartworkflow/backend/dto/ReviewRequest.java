package com.smartworkflow.backend.dto;

import com.smartworkflow.backend.entity.TaskStatus;

public class ReviewRequest {

    private TaskStatus status;
    private String feedback;

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }
}