import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Card = ({ title, value, color }) => (
    <div className="col-md-4 mb-4">
        <div className={`card shadow-sm border-${color}`}>
            <div className="card-body text-center">
                <h6 className="text-muted">{title}</h6>
                <h3 className={`text-${color}`}>{value}</h3>
            </div>
        </div>
    </div>
);

function ManagerDashboard() {

    const [data, setData] = useState({});
    const token = localStorage.getItem("token");
    const API = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetch(`${API}/dashboard/manager`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => res.json())
            .then(setData);
    }, [token]);

    const chartData = {
        labels: ["Pending", "In Progress", "Submitted", "Approved", "Rejected"],
        datasets: [
            {
                data: [
                    data.pending || 0,
                    data.inProgress || 0,
                    data.submitted || 0,
                    data.approved || 0,
                    data.rejected || 0,
                ],
                backgroundColor: [
                    "#6c757d",
                    "#0d6efd",
                    "#0dcaf0",
                    "#198754",
                    "#dc3545",
                ],
            },
        ],
    };

    return (
        <div className="container-fluid">
            <h2 className="mb-4">Manager Dashboard</h2>

            <div className="row">
                <Card title="Total Tasks" value={data.totalTasks} color="dark" />
                <Card title="Pending" value={data.pending} color="secondary" />
                <Card title="In Progress" value={data.inProgress} color="primary" />
                <Card title="Submitted" value={data.submitted} color="info" />
                <Card title="Approved" value={data.approved} color="success" />
                <Card title="Rejected" value={data.rejected} color="danger" />
            </div>

            <div className="card shadow-sm p-4 mt-3">
                <h5>Completion Rate</h5>
                <div className="progress mt-2">
                    <div
                        className="progress-bar bg-success"
                        style={{ width: `${data.completionRate || 0}%` }}
                    >
                        {data.completionRate?.toFixed(1) || 0}%
                    </div>
                </div>
            </div>

            <div className="card shadow-sm p-4 mt-4">
                <h5>Task Distribution</h5>
                <div style={{ maxWidth: "400px" }}>
                    <Pie data={chartData} />
                </div>
            </div>
        </div>
    );
}

export default ManagerDashboard;