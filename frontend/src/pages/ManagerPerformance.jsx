import { useEffect, useState } from "react";

function ManagerPerformance() {

    const token = localStorage.getItem("token");

    const [data, setData] = useState([]);

    const fetchPerformance = async () => {
        try {
            const response = await fetch(
                "http://localhost:8080/performance/manager",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const result = await response.json();
            setData(result);

        } catch (error) {
            console.error("Error fetching performance:", error);
        }
    };

    useEffect(() => {
        fetchPerformance();
    }, []);

    return (
        <div className="container-fluid">
            <h2 className="mb-4">Employee Performance</h2>

            <div className="card shadow-sm p-3">
                <table className="table table-hover">

                    <thead className="table-dark">
                    <tr>
                        <th>Employee</th>
                        <th>Total Tasks</th>
                        <th>Completed</th>
                        <th>Pending</th>
                        <th>Performance %</th>
                    </tr>
                    </thead>

                    <tbody>

                    {data.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center">
                                No performance data
                            </td>
                        </tr>
                    ) : (
                        data.map((emp) => (
                            <tr key={emp.employeeId}>
                                <td>{emp.name}</td>
                                <td>{emp.totalTasks}</td>
                                <td>{emp.completedTasks}</td>
                                <td>{emp.pendingTasks}</td>
                                <td>
                                       <span
                                           className={`badge ${
                                               emp.performancePercentage >= 70
                                                   ? "bg-success"
                                                   : emp.performancePercentage >= 40
                                                       ? "bg-warning text-dark"
                                                       : "bg-danger"
                                           }`}
                                       >
    {emp.performancePercentage}%
</span>
                                </td>
                            </tr>
                        ))
                    )}

                    </tbody>

                </table>
            </div>
        </div>
    );
}

export default ManagerPerformance;