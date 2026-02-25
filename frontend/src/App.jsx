import { useState } from "react";

function App() {
    const role = localStorage.getItem("role");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [dashboardData, setDashboardData] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem("token") !== null
    );


    // ================= LOGIN =================
    const handleLogin = async () => {
        try {
            const response = await fetch("http://localhost:8080/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                alert(errorText);
                return;
            }

            const data = await response.json();

            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            localStorage.setItem("email", data.email);

            setIsLoggedIn(true);

        } catch (error) {
            console.error("Login Error:", error);
        }
    };

    // ================= DASHBOARD =================
    const fetchDashboard = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch("http://localhost:8080/dashboard", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            const data = await response.json();
            setDashboardData(data);

        } catch (error) {
            console.error("Error fetching dashboard:", error);
        }
    };

    // ================= FETCH TASKS (ROLE BASED) =================
    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem("token");
            const role = localStorage.getItem("role");

            let url = "";

            if (role === "ROLE_MANAGER" || role === "ROLE_ADMIN") {
                url = "http://localhost:8080/tasks";
            } else if (role === "ROLE_EMPLOYEE") {
                url = "http://localhost:8080/tasks/my-tasks";
            }

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            const data = await response.json();
            setTasks(data);

        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    // ================= UPDATE STATUS =================
    const updateTaskStatus = async (taskId, status) => {
        try {
            const token = localStorage.getItem("token");

            await fetch(
                `http://localhost:8080/tasks/${taskId}/status?status=${status}`,
                {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            fetchTasks(); // FIXED (was fetchAllTasks before)

        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    // ================= LOGOUT =================
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("email");

        setIsLoggedIn(false);
        setDashboardData(null);
        setTasks([]);
    };

    // ================= DASHBOARD PAGE =================
    if (isLoggedIn) {
        return (
            <div className="container mt-5">

                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Dashboard 📊</h2>
                    <button
                        className="btn btn-danger"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>

                {/* Dashboard Button */}
                <button
                    className="btn btn-primary mb-4"
                    onClick={fetchDashboard}
                >
                    Load Dashboard Data
                </button>

                {/* Dashboard Cards */}
                {dashboardData && (
                    <div className="row text-center mb-4">
                        {[
                            { label: "Total", value: dashboardData.totalTasks },
                            { label: "Pending", value: dashboardData.pending },
                            { label: "In Progress", value: dashboardData.inProgress },
                            { label: "Submitted", value: dashboardData.submitted },
                            { label: "Approved", value: dashboardData.approved },
                            { label: "Rejected", value: dashboardData.rejected }
                        ].map((item, index) => (
                            <div className="col-md-2" key={index}>
                                <div className="card shadow-sm p-3 mb-3">
                                    <h6>{item.label}</h6>
                                    <h4>{item.value}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <hr />



                {role === "ROLE_ADMIN" && (
                    <h4 className="mb-3">Admin - All Tasks</h4>
                )}

                {role === "ROLE_MANAGER" && (
                    <h4 className="mb-3">Manager - All Tasks</h4>
                )}

                {role === "ROLE_EMPLOYEE" && (
                    <h4 className="mb-3">My Tasks</h4>
                )}

                <button
                    className="btn btn-success mb-3"
                    onClick={fetchTasks}
                >
                    {role === "ROLE_EMPLOYEE"
                        ? "Load My Tasks"
                        : "Load All Tasks"}
                </button>

                {tasks.length > 0 && (
                    <table className="table table-bordered table-striped">
                        <thead className="table-dark">
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Assigned To</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tasks.map((task) => (
                            <tr key={task.id}>
                                <td>{task.title}</td>
                                <td>{task.description}</td>
                                <td>{task.status}</td>
                                <td>{task.assignedEmployee?.name}</td>
                                <td>
                                    {role !== "ROLE_EMPLOYEE" &&
                                        task.status === "SUBMITTED" && (
                                            <>
                                                <button
                                                    className="btn btn-success btn-sm me-2"
                                                    onClick={() =>
                                                        updateTaskStatus(task.id, "APPROVED")
                                                    }
                                                >
                                                    Approve
                                                </button>

                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() =>
                                                        updateTaskStatus(task.id, "REJECTED")
                                                    }
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
                )}
            </div>
        );
    }

    // ================= LOGIN PAGE =================
    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow p-4" style={{ width: "400px" }}>
                <h3 className="text-center mb-4">Smart Workflow Login</h3>

                <input
                    type="email"
                    className="form-control mb-3"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    className="form-control mb-3"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    className="btn btn-primary w-100"
                    onClick={handleLogin}
                >
                    Login
                </button>
            </div>
        </div>
    );
}

export default App;