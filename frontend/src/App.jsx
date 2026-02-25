import AdminUsers from "./pages/AdminUsers";
import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./layout/Sidebar";
import AdminPerformance from "./pages/AdminPerformance";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem("token") !== null
    );

    const role = localStorage.getItem("role");

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

    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
    };

    // ================= LOGIN PAGE =================
    if (!isLoggedIn) {
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

                    <button className="btn btn-primary w-100" onClick={handleLogin}>
                        Login
                    </button>
                </div>
            </div>
        );
    }

    // ================= MAIN LAYOUT =================
    return (
        <div className="d-flex">
            <Sidebar role={role} />

            <div className="flex-grow-1 p-4">


                <Routes>

                    {/* ADMIN ROUTES */}
                    {role === "ROLE_ADMIN" && (
                        <>
                            <Route path="/" element={<AdminDashboard />} />
                            <Route path="/admin/users" element={<AdminUsers />} />
                            <Route path="/admin/performance" element={<AdminPerformance />} />
                        </>
                    )}

                    {/* MANAGER ROUTES */}
                    {role === "ROLE_MANAGER" && (
                        <>
                            <Route path="/" element={<h2>Manager Dashboard</h2>} />
                            <Route path="/manager/tasks" element={<h2>Manager Tasks</h2>} />
                        </>
                    )}

                    {/* EMPLOYEE ROUTES */}
                    {role === "ROLE_EMPLOYEE" && (
                        <>
                            <Route path="/" element={<h2>Employee Dashboard</h2>} />
                            <Route path="/employee/tasks" element={<h2>Employee Tasks</h2>} />
                        </>
                    )}

                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;