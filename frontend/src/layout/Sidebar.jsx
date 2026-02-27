import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
    FaTachometerAlt,
    FaUsers,
    FaChartLine,
    FaTasks,
    FaSignOutAlt,
    FaBars
} from "react-icons/fa";

const Sidebar = ({ role }) => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div
            className="d-flex flex-column text-white p-3 position-fixed"
            style={{
                width: collapsed ? "80px" : "250px",
                height: "100vh",
                background: "linear-gradient(180deg, #111827, #1f2937)",
                transition: "0.3s ease",
                boxShadow: "2px 0 10px rgba(0,0,0,0.2)",
                overflowY: "auto"
            }}
        >
            {/* TOGGLE */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                {!collapsed && <h5 className="fw-bold m-0">Smart Workflow</h5>}
                <FaBars
                    style={{ cursor: "pointer" }}
                    onClick={() => setCollapsed(!collapsed)}
                />
            </div>

            <ul className="nav nav-pills flex-column mb-auto">

                {/* Dashboard */}
                <li className="nav-item mb-2">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `nav-link d-flex align-items-center ${
                                isActive ? "active bg-primary" : "text-white"
                            }`
                        }
                    >
                        <FaTachometerAlt />
                        {!collapsed && <span className="ms-2">Dashboard</span>}
                    </NavLink>
                </li>

                {/* ADMIN MENU */}
                {role === "ROLE_ADMIN" && (
                    <>
                        <li className="mb-2">
                            <NavLink
                                to="/admin/users"
                                className={({ isActive }) =>
                                    `nav-link d-flex align-items-center ${
                                        isActive ? "active bg-primary" : "text-white"
                                    }`
                                }
                            >
                                <FaUsers />
                                {!collapsed && <span className="ms-2">Users</span>}
                            </NavLink>
                        </li>

                        <li className="mb-2">
                            <NavLink
                                to="/admin/performance"
                                className={({ isActive }) =>
                                    `nav-link d-flex align-items-center ${
                                        isActive ? "active bg-primary" : "text-white"
                                    }`
                                }
                            >
                                <FaChartLine />
                                {!collapsed && <span className="ms-2">Performance</span>}
                            </NavLink>
                        </li>
                    </>
                )}

                {/* MANAGER MENU */}
                {role === "ROLE_MANAGER" && (
                    <li className="mb-2">
                        <NavLink
                            to="/manager/tasks"
                            className={({ isActive }) =>
                                `nav-link d-flex align-items-center ${
                                    isActive ? "active bg-primary" : "text-white"
                                }`
                            }
                        >
                            <FaTasks />
                            {!collapsed && <span className="ms-2">My Tasks</span>}
                        </NavLink>
                    </li>
                )}

                {/* EMPLOYEE MENU */}
                {role === "ROLE_EMPLOYEE" && (
                    <li className="mb-2">
                        <NavLink
                            to="/employee/tasks"
                            className={({ isActive }) =>
                                `nav-link d-flex align-items-center ${
                                    isActive ? "active bg-primary" : "text-white"
                                }`
                            }
                        >
                            <FaTasks />
                            {!collapsed && <span className="ms-2">My Tasks</span>}
                        </NavLink>
                    </li>
                )}

            </ul>

            {/* LOGOUT */}
            <div className="mt-auto">
                <hr className="border-secondary" />
                <button
                    className="btn btn-danger w-100 d-flex align-items-center justify-content-center"
                    onClick={() => {
                        localStorage.clear();
                        window.location.href = "/";
                    }}
                >
                    <FaSignOutAlt />
                    {!collapsed && <span className="ms-2">Logout</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;