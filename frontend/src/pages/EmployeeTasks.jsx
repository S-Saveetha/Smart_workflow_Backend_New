import { useEffect, useState } from "react";

function EmployeeTasks() {

    const [tasks, setTasks] = useState([]);
    const token = localStorage.getItem("token");

    const fetchTasks = async () => {
        const response = await fetch("http://localhost:8080/tasks/my-tasks", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();
        setTasks(data);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const updateStatus = async (taskId, status) => {
        await fetch(`http://localhost:8080/tasks/${taskId}/status?status=${status}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        fetchTasks();
    };

    return (
        <div className="container-fluid">
            <h2 className="mb-4">My Assigned Tasks</h2>

            <div className="card shadow-sm p-3">
                <table className="table table-hover">
                    <thead className="table-dark">
                    <tr>
                        <th>Title</th>
                        <th>Deadline</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tasks.map((task) => (
                        <tr key={task.id}>
                            <td>{task.title}</td>
                            <td>{task.deadline}</td>
                            <td>
                                    <span className={`badge ${
                                        task.priority === "HIGH"
                                            ? "bg-danger"
                                            : task.priority === "MEDIUM"
                                                ? "bg-warning"
                                                : "bg-success"
                                    }`}>
                                        {task.priority}
                                    </span>
                            </td>
                            <td>{task.status}</td>
                            <td>
                                {task.status === "PENDING" && (
                                    <button
                                        className="btn btn-sm btn-primary"
                                        onClick={() => updateStatus(task.id, "IN_PROGRESS")}
                                    >
                                        Start
                                    </button>
                                )}

                                {task.status === "IN_PROGRESS" && (
                                    <button
                                        className="btn btn-sm btn-success"
                                        onClick={() => updateStatus(task.id, "SUBMITTED")}
                                    >
                                        Submit
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default EmployeeTasks;