import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ManagerTasks from "./pages/ManagerTasks";
import Sidebar from "./layout/Sidebar";
import EmployeeTasks from "./pages/EmployeeTasks";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminPerformance from "./pages/AdminPerformance";

import ManagerDashboard from "./pages/ManagerDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ManagerPerformance from "./pages/ManagerPerformance";
import Profile from "./pages/Profile";

function App() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem("token") !== null
    );

    const role = localStorage.getItem("role");

    // ================= LOGIN =================
    const handleLogin = async () => {
        try {
            setLoginError("");

            const response = await fetch(`${import.meta.env.VITE_API_URL}/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorText = await response.text();

                if (errorText === "INVALID_PASSWORD") {
                    setLoginError("Invalid password");
                } else if (errorText === "User not found") {
                    setLoginError("Invalid email");
                } else if (errorText === "ACCOUNT_DEACTIVATED") {
                    setLoginError("Account is deactivated");
                } else {
                    setLoginError(errorText);
                }
                return;
            }

            const data = await response.json();

            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            localStorage.setItem("email", data.email);
            localStorage.setItem("name", data.name);

            setIsLoggedIn(true);
        } catch (error) {
            console.error("Login.jsx Error:", error);
            setLoginError("Something went wrong. Please try again.");
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
    };

    // ================= LOGIN PAGE =================
    if (!isLoggedIn) {
        return (
            <div className="d-flex vh-100">

                {/* LEFT SIDE – Branding */}
                <div
                    className="d-flex flex-column justify-content-center align-items-center text-white"
                    style={{
                        flex: 1,
                        background: "linear-gradient(135deg, #4e73df, #1cc88a)",
                    }}
                >
                    <h1 className="fw-bold">Smart Workflow</h1>
                    <p className="mt-3 text-center px-5">
                        Enterprise Task & Workforce Management System
                    </p>
                </div>

                {/* RIGHT SIDE – Login.jsx Form */}
                <div className="d-flex justify-content-center align-items-center bg-light" style={{ flex: 1 }}>
                    <div className="card shadow-lg p-5" style={{ width: "400px", borderRadius: "20px" }}>
                        <h3 className="text-center mb-4 fw-bold">Login</h3>

                        <div className="mb-3">
                            <label className="form-label fw-semibold">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Enter your email"
                                autoComplete="username"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {loginError && (
                            <div className="alert alert-danger py-2 text-center">
                                {loginError}
                            </div>
                        )}

                        <button
                            className="btn btn-primary w-100 fw-semibold"
                            onClick={handleLogin}
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ================= MAIN LAYOUT =================
    return (
        <div className="d-flex">
            <Sidebar role={role} onLogout={handleLogout} />

            <div
                className="flex-grow-1 p-4"
                style={{ marginLeft: "250px", transition: "0.3s ease" }}
            >
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
                            <Route path="/" element={<ManagerDashboard />} />
                            <Route path="/manager/tasks" element={<ManagerTasks />} />
                            <Route path="/manager/performance" element={<ManagerPerformance />} />
                        </>
                    )}

                    {/* EMPLOYEE ROUTES */}
                    {role === "ROLE_EMPLOYEE" && (
                        <>
                            <Route path="/" element={<EmployeeDashboard />} />
                            <Route path="/employee/tasks" element={<EmployeeTasks />} />
                        </>
                    )}

                    {/* PROFILE ROUTE (ALL ROLES) */}
                    <Route path="/profile" element={<Profile />} />

                    {/* DEFAULT REDIRECT */}
                    <Route path="*" element={<Navigate to="/" />} />

                </Routes>
            </div>
        </div>
    );
}

export default App;