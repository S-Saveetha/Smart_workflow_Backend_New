import { Bar } from "react-chartjs-2";
import { useEffect, useState, useMemo } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function AdminPerformance() {

    const token = localStorage.getItem("token");

    const [data, setData] = useState([]);
    const [managers, setManagers] = useState([]);

    // Fetch managers list
    const fetchManagers = async () => {
        try {
            const response = await fetch(
                "http://localhost:8080/users/managers",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const result = await response.json();
            setManagers(result);

        } catch (error) {
            console.error("Managers fetch error:", error);
        }
    };

    // Fetch performance of employees under selected manager
    const fetchManagerPerformance = async (managerId) => {
        try {
            const response = await fetch(
                `http://localhost:8080/performance/manager/${managerId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const result = await response.json();
            setData(result);

        } catch (error) {
            console.error("Manager performance error:", error);
        }
    };

    // Load managers when page opens
    useEffect(() => {
        fetchManagers();
    }, []);

    const chartData = useMemo(() => ({
        labels: data.map((user) => user.name),
        datasets: [
            {
                label: "Performance %",
                data: data.map((user) => user.performancePercentage),
                backgroundColor: data.map((user) =>
                    user.performancePercentage >= 70
                        ? "rgba(40,167,69,0.7)"
                        : user.performancePercentage >= 40
                            ? "rgba(255,193,7,0.7)"
                            : "rgba(220,53,69,0.7)"
                ),
            },
        ],
    }), [data]);

    return (
        <div className="container-fluid">

            {/* MANAGERS LIST */}

            <div className="card shadow-sm p-4 mb-4">

                <h3 className="mb-3">Managers</h3>

                <table className="table table-hover">

                    <thead className="table-dark">
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Action</th>
                    </tr>
                    </thead>

                    <tbody>

                    {managers.map((manager) => (

                        <tr key={manager.id}>

                            <td>{manager.name}</td>
                            <td>{manager.email}</td>

                            <td>
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() =>
                                        fetchManagerPerformance(manager.id)
                                    }
                                >
                                    View Team Performance
                                </button>
                            </td>

                        </tr>

                    ))}

                    </tbody>

                </table>

            </div>

            {/* PERFORMANCE SECTION */}

            {data.length > 0 && (

                <div className="card shadow-sm p-4">

                    <h3 className="mb-4">Team Performance</h3>

                    <div style={{ height: "350px" }}>
                        <Bar
                            data={chartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        max: 100,
                                        ticks: {
                                            stepSize: 10
                                        }
                                    }
                                }
                            }}
                        />
                    </div>

                    <hr className="my-4" />

                    <table className="table table-hover align-middle">

                        <thead className="table-dark">
                        <tr>
                            <th>Employee</th>
                            <th>Total Tasks</th>
                            <th>Completed</th>
                            <th>Pending</th>
                            <th>Performance</th>
                        </tr>
                        </thead>

                        <tbody>

                        {data.map((user) => (

                            <tr key={user.employeeId}>

                                <td>{user.name}</td>

                                <td>{user.totalTasks}</td>

                                <td className="text-success">
                                    {user.completedTasks}
                                </td>

                                <td className="text-warning">
                                    {user.pendingTasks}
                                </td>

                                <td>

                                        <span
                                            className={`badge ${
                                                user.performancePercentage >= 80
                                                    ? "bg-success"
                                                    : user.performancePercentage >= 50
                                                        ? "bg-warning text-dark"
                                                        : "bg-danger"
                                            }`}
                                        >
                                            {user.performancePercentage.toFixed(1)}%
                                        </span>

                                </td>

                            </tr>

                        ))}

                        </tbody>

                    </table>

                </div>

            )}

        </div>
    );
}

export default AdminPerformance;