
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
    const [data, setData] = useState([]);
    const token = localStorage.getItem("token");

    const fetchPerformance = async () => {
        try {
            const response = await fetch(
                "http://localhost:8080/performance",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) throw new Error("Failed to fetch performance");

            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        const load = async () => {
            await fetchPerformance();
        };
        load();
    }, []);

    const chartData = useMemo(() => ({
        labels: data.map((user) => user.name),
        datasets: [
            {
                label: "Performance (%)",
                data: data.map((user) => user.performancePercentage),
                backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
        ],
    }), [data]);

    return (
        <div className="container-fluid">
            <div className="card shadow-sm p-4">
                <h2 className="mb-4">Performance Dashboard</h2>

                {data.length > 0 ? (
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
                ) : (
                    <p className="text-muted">No performance data available.</p>
                )}
            </div>
        </div>
    );
}

export default AdminPerformance;