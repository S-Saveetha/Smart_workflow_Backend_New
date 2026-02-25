import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ role }) => {
    return (
        <div className="d-flex flex-column vh-100 bg-dark text-white p-3">

            {/* TOP SECTION */}
            <div>
                <h4 className="mb-4">Smart Workflow</h4>

                <ul className="nav nav-pills flex-column mb-auto">
                    <li className="nav-item">
                        <Link to="/" className="nav-link text-white">
                            Dashboard
                        </Link>
                    </li>

                    {role === "ROLE_ADMIN" && (
                        <>
                            <li>
                                <Link to="/admin/users" className="nav-link text-white">
                                    User Management
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin/performance" className="nav-link text-white">
                                    Performance
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>

            {/* PUSHES LOGOUT TO BOTTOM */}
            <div className="mt-auto">
                <hr />
                <button
                    className="btn btn-danger w-100"
                    onClick={() => {
                        localStorage.clear();
                        window.location.href = "/";
                    }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;