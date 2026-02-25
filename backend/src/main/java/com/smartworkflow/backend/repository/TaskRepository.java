package com.smartworkflow.backend.repository;

import com.smartworkflow.backend.entity.Task;
import com.smartworkflow.backend.entity.TaskStatus;
import com.smartworkflow.backend.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    long countByAssignedEmployeeId(Long employeeId);

    long countByAssignedEmployeeIdAndStatus(Long employeeId, TaskStatus status);

    long countByStatus(TaskStatus status);

    long countByCreatedByManagerId(Long managerId);

    long countByCreatedByManagerIdAndStatus(Long managerId, TaskStatus status);

    List<Task> findByAssignedEmployeeId(Long employeeId);

    List<Task> findByCreatedByManager(User manager);

    List<Task> findByAssignedEmployee(User employee);
}