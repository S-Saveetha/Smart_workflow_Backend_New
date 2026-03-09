import { useEffect, useState } from "react";
import DashboardCards from "../Components/DashboardCards";

function EmployeeDashboard() {
    const [data, setData] = useState(null);
    const token = localStorage.getItem("token");
    const API = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetch(`${API}/dashboard`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => res.json())
            .then(setData);
    }, []);

    if (!data) return <p>Loading...</p>;

    return <DashboardCards data={data} role="ROLE_EMPLOYEE" />;
}

export default EmployeeDashboard;