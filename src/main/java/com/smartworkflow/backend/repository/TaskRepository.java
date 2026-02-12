package com.smartworkflow.backend.repository;
import com.smartworkflow.backend.entity.TaskStatus;


import com.smartworkflow.backend.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
    long countByAssignedEmployeeId(Long employeeId);

    long countByAssignedEmployeeIdAndStatus(Long employeeId, TaskStatus status);

}
