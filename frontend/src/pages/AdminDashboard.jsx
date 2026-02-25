import { useEffect, useState } from "react";

function AdminDashboard() {
    const [data, setData] = useState(null);
    const [recentTasks, setRecentTasks] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                // Fetch main dashboard data
                const response = await fetch("http://localhost:8080/dashboard", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const result = await response.json();
                setData(result);

                // Fetch recent tasks
                const response2 = await fetch("http://localhost:8080/dashboard/recent", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const recent = await response2.json();
                setRecentTasks(recent);

            } catch (error) {
                console.error("Dashboard error:", error);
            }
        };

        loadDashboard();
    }, []);

    if (!data) return <p>Loading...</p>;

    return (
        <div className="container-fluid">
            <h2 className="mb-4">Admin Dashboard</h2>

            {/* KPI CARDS */}
            <div className="row g-4 mb-5">

                <div className="col-md-4">
                    <div className="card shadow-sm p-3 text-center">
                        <h6>Total Tasks</h6>
                        <h3>{data.totalTasks}</h3>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm p-3 text-center">
                        <h6>Pending</h6>
                        <h3 className="text-warning">{data.pending}</h3>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm p-3 text-center">
                        <h6>In Progress</h6>
                        <h3 className="text-primary">{data.inProgress}</h3>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm p-3 text-center">
                        <h6>Submitted</h6>
                        <h3 className="text-info">{data.submitted}</h3>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm p-3 text-center">
                        <h6>Approved</h6>
                        <h3 className="text-success">{data.approved}</h3>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm p-3 text-center">
                        <h6>Rejected</h6>
                        <h3 className="text-danger">{data.rejected}</h3>
                    </div>
                </div>

            </div>

            {/* RECENT TASKS TABLE */}
            <h4 className="mb-3">Recent Tasks</h4>

            <div className="card shadow-sm p-3">
                <table className="table table-hover align-middle">
                    <thead className="table-dark">
                    <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Assigned To</th>
                    </tr>
                    </thead>
                    <tbody>
                    {recentTasks.length > 0 ? (
                        recentTasks.map(task => (
                            <tr key={task.id}>
                                <td>{task.title}</td>
                                <td>{task.status}</td>
                                <td>{task.assignedEmployee?.name}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="text-center text-muted">
                                No recent tasks available
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default AdminDashboard;