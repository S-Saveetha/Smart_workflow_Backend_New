import { useEffect, useState } from "react";

function ManagerTasks() {

    const [tasks, setTasks] = useState([]);
    const token = localStorage.getItem("token");

    const fetchTasks = async () => {
        try {
            const response = await fetch("http://localhost:8080/tasks/manager", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
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
            <h2 className="mb-4">My Created Tasks</h2>

            <div className="card shadow-sm p-3">
                <table className="table table-hover">
                    <thead className="table-dark">
                    <tr>
                        <th>Title</th>
                        <th>Employee</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tasks.map((task) => (
                        <tr key={task.id}>
                            <td>{task.title}</td>
                            <td>{task.assignedEmployee?.name}</td>
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
                                {task.status === "SUBMITTED" && (
                                    <>
                                        <button
                                            className="btn btn-sm btn-success me-2"
                                            onClick={() => updateStatus(task.id, "APPROVED")}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => updateStatus(task.id, "REJECTED")}
                                        >
                                            Reject
                                        </button>
                                    </>
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

export default ManagerTasks;