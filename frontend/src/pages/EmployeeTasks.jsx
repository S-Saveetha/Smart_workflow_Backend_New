import { useEffect, useState } from "react";

function EmployeeTasks() {
    const [tasks, setTasks] = useState([]);
    const token = localStorage.getItem("token");

    const [activeSubmitTaskId, setActiveSubmitTaskId] = useState(null);
    const [submissionLink, setSubmissionLink] = useState("");

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
        await fetch(
            `http://localhost:8080/tasks/${taskId}/status?status=${status}`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        fetchTasks();
    };

    const submitTask = async (taskId) => {
        if (!submissionLink) {
            alert("Please enter submission link");
            return;
        }

        await fetch(`http://localhost:8080/tasks/${taskId}/submit`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                submissionLink: submissionLink,
            }),
        });

        setActiveSubmitTaskId(null);
        setSubmissionLink("");
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
                        <>
                            <tr key={task.id}>
                                <td>{task.title}</td>

                                <td>{task.deadline}</td>

                                <td>
                                        <span
                                            className={`badge ${
                                                task.priority === "HIGH"
                                                    ? "bg-danger"
                                                    : task.priority === "MEDIUM"
                                                        ? "bg-warning"
                                                        : "bg-success"
                                            }`}
                                        >
                                            {task.priority}
                                        </span>
                                </td>

                                <td>
                                    <div>{task.status}</div>

                                    {task.managerFeedback && (
                                        <div
                                            className={`small mt-1 ${
                                                task.status === "APPROVED"
                                                    ? "text-success"
                                                    : task.status === "REJECTED"
                                                        ? "text-danger"
                                                        : ""
                                            }`}
                                        >
                                            Feedback: {task.managerFeedback}
                                        </div>
                                    )}
                                </td>

                                <td>
                                    {task.status === "PENDING" && (
                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() =>
                                                updateStatus(
                                                    task.id,
                                                    "IN_PROGRESS"
                                                )
                                            }
                                        >
                                            Start
                                        </button>
                                    )}

                                    {(task.status === "IN_PROGRESS" ||
                                        task.status === "REJECTED") && (
                                        <button
                                            className={`btn btn-sm ${
                                                task.status === "REJECTED"
                                                    ? "btn-warning"
                                                    : "btn-success"
                                            }`}
                                            onClick={() => {
                                                setActiveSubmitTaskId(
                                                    task.id
                                                );
                                                setSubmissionLink("");
                                            }}
                                        >
                                            {task.status === "REJECTED"
                                                ? "Resubmit"
                                                : "Submit Work"}
                                        </button>
                                    )}
                                </td>
                            </tr>

                            {/* INLINE SUBMISSION SECTION */}
                            {activeSubmitTaskId === task.id && (
                                <tr>
                                    <td colSpan="5">
                                        <div className="p-3 bg-light border rounded">
                                            <input
                                                type="text"
                                                className="form-control mb-2"
                                                placeholder="Paste GitHub / Drive / PDF link"
                                                value={submissionLink}
                                                onChange={(e) =>
                                                    setSubmissionLink(
                                                        e.target.value
                                                    )
                                                }
                                            />

                                            <button
                                                className="btn btn-success btn-sm me-2"
                                                onClick={() =>
                                                    submitTask(task.id)
                                                }
                                            >
                                                Submit
                                            </button>

                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() =>
                                                    setActiveSubmitTaskId(
                                                        null
                                                    )
                                                }
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default EmployeeTasks;