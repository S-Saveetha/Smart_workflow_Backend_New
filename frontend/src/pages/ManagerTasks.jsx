import { useEffect, useState } from "react";

function ManagerTasks() {

    const token = localStorage.getItem("token");

    const [tasks, setTasks] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState("");
    const [assignedEmployeeId, setAssignedEmployeeId] = useState("");
    const [priority, setPriority] = useState("MEDIUM");
    const [showModal, setShowModal] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [reviewStatus, setReviewStatus] = useState("");
    const [feedback, setFeedback] = useState("");

    // ================= FETCH TASKS =================
    const fetchTasks = async () => {
        try {
            const response = await fetch("http://localhost:8080/tasks/manager", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    // ================= FETCH EMPLOYEES =================
    const fetchEmployees = async () => {
        try {
            const response = await fetch("http://localhost:8080/users", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await response.json();

            const onlyEmployees = data.filter(
                (user) => user.role?.name === "ROLE_EMPLOYEE"
            );

            setEmployees(onlyEmployees);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    useEffect(() => {
        fetchTasks();
        fetchEmployees();
    }, []);

    // ================= CREATE TASK =================
    const createTask = async () => {
        if (!title || !description || !deadline || !assignedEmployeeId) {
            alert("Please fill all fields");
            return;
        }

        try {
            await fetch("http://localhost:8080/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title,
                    description,
                    deadline,
                    assignedEmployeeId: Number(assignedEmployeeId),
                    priority
                }),
            });

            // Reset form
            setTitle("");
            setDescription("");
            setDeadline("");
            setAssignedEmployeeId("");
            setPriority("MEDIUM");

            fetchTasks();
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };

    const confirmReview = async () => {
        if (!feedback) {
            alert("Feedback is required");
            return;
        }

        await fetch(`http://localhost:8080/tasks/${selectedTaskId}/review`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                status: reviewStatus,
                feedback: feedback
            }),
        });

        setShowModal(false);
        setFeedback("");
        fetchTasks();
    };

    // ================= REVIEW TASK =================
    const reviewTask = async (taskId, status) => {
        const feedback = prompt(
            status === "APPROVED"
                ? "Enter approval feedback:"
                : "Enter rejection reason:"
        );

        if (!feedback) return;

        try {
            await fetch(`http://localhost:8080/tasks/${taskId}/review`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    status,
                    feedback
                }),
            });

            fetchTasks();
        } catch (error) {
            console.error("Error reviewing task:", error);
        }
    };

    return (
        <div className="container-fluid">
            <h2 className="mb-4">My Created Tasks</h2>

            {/* ================= CREATE TASK FORM ================= */}
            <div className="card shadow-sm p-3 mb-4">
                <h5>Create Task</h5>

                <div className="row g-3">

                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="col-md-2">
                        <input
                            type="date"
                            className="form-control"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                        />
                    </div>

                    <div className="col-md-2">
                        <select
                            className="form-select"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                        >
                            <option value="HIGH">High</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="LOW">Low</option>
                        </select>
                    </div>

                    <div className="col-md-2">
                        <select
                            className="form-select"
                            value={assignedEmployeeId}
                            onChange={(e) => setAssignedEmployeeId(e.target.value)}
                        >
                            <option value="">Assign Employee</option>
                            {employees.map((emp) => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-1">
                        <button
                            className="btn btn-primary w-100"
                            onClick={createTask}
                        >
                            Create
                        </button>
                    </div>
                </div>
            </div>

            {/* ================= TASK TABLE ================= */}
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
                                    <span
                                        className={`badge ${
                                            task.priority === "HIGH"
                                                ? "bg-danger"
                                                : task.priority === "MEDIUM"
                                                    ? "bg-warning text-dark"
                                                    : "bg-success"
                                        }`}
                                    >
                                        {task.priority}
                                    </span>
                            </td>

                            <td>{task.status}</td>

                            <td>
                                {task.status === "SUBMITTED" ? (
                                    <>
                                        <a
                                            href={task.submissionLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-sm btn-info me-2"
                                        >
                                            View Work
                                        </a>

                                        <button
                                            className="btn btn-sm btn-success me-2"
                                            onClick={() => {
                                                setSelectedTaskId(task.id);
                                                setReviewStatus("APPROVED");
                                                setShowModal(true);
                                            }}
                                        >
                                            Approve
                                        </button>

                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => {
                                                setSelectedTaskId(task.id);
                                                setReviewStatus("REJECTED");
                                                setShowModal(true);
                                            }}
                                        >
                                            Reject
                                        </button>
                                    </>
                                ) : (
                                    <span className="text-muted">
                                            No Actions
                                        </span>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div
                    className="modal fade show d-block"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content shadow">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {reviewStatus === "APPROVED"
                                        ? "Approve Task"
                                        : "Reject Task"}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                />
                            </div>

                            <div className="modal-body">
                    <textarea
                        className="form-control"
                        rows="4"
                        placeholder="Enter feedback..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                    />
                            </div>

                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    className={`btn ${
                                        reviewStatus === "APPROVED"
                                            ? "btn-success"
                                            : "btn-danger"
                                    }`}
                                    onClick={confirmReview}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManagerTasks;