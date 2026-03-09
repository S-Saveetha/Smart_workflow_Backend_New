import { useEffect, useState } from "react";
import DashboardCards from "../Components/DashboardCards";

function AdminDashboard() {
    const [data, setData] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/dashboard`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to fetch dashboard data");
                }
                return res.json();
            })
            .then(data => setData(data))
            .catch(err => {
                console.error("Dashboard error:", err);
                setData({});
            });
    }, [token]);

    if (!data) return <p className="p-4">Loading dashboard...</p>;

    return <DashboardCards data={data} role="ROLE_ADMIN" />;
}

export default AdminDashboard;