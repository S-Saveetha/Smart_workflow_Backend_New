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
            <div
                className="d-flex justify-content-center align-items-center min-vh-100"
                style={{
                    backgroundColor: "#eef1f7",
                }}
            >
                <div
                    className="card shadow-sm border-0 p-4"
                    style={{
                        width: "100%",
                        maxWidth: "500px",
                        borderRadius: "18px",
                        backgroundColor: "#ffffff",
                    }}
                >
                    <div className="text-center mb-4">
                        <div
                            className="d-inline-flex justify-content-center align-items-center mb-3"
                            style={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #6f42c1, #8b5cf6)",
                                color: "white",
                                fontSize: "28px",
                                fontWeight: "bold",
                            }}
                        >
                            SW
                        </div>

                        <h3 className="fw-bold mb-2" style={{ color: "#111827" }}>
                            Smart Workflow
                        </h3>

                        <p className="mb-0" style={{ color: "#7c3aed", fontWeight: "600" }}>
                            Welcome Back!
                        </p>
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter your email"
                            autoComplete="username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                height: "48px",
                                borderRadius: "10px",
                                backgroundColor: "#f3f6fb",
                                border: "1px solid #dbe2ea",
                            }}
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
                            style={{
                                height: "48px",
                                borderRadius: "10px",
                                backgroundColor: "#f3f6fb",
                                border: "1px solid #dbe2ea",
                            }}
                        />
                    </div>

                    {loginError && (
                        <div className="alert alert-danger py-2 text-center">
                            {loginError}
                        </div>
                    )}

                    <button
                        className="btn w-100 fw-semibold text-white"
                        onClick={handleLogin}
                        style={{
                            height: "48px",
                            borderRadius: "10px",
                            background: "linear-gradient(135deg, #6f42c1, #8b5cf6)",
                            border: "none",
                        }}
                    >
                        Sign In
                    </button>
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