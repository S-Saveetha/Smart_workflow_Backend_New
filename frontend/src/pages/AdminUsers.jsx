import { useEffect, useState } from "react";

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        password: "",
        role: "ROLE_EMPLOYEE",
        managerId: ""
    });

    const token = localStorage.getItem("token");
    const API = import.meta.env.VITE_API_URL;
    const currentEmail = localStorage.getItem("email");

    const [showReassignModal, setShowReassignModal] = useState(false);
    const [selectedManager, setSelectedManager] = useState(null);
    const [managerEmployees, setManagerEmployees] = useState([]);
    const [newManagerId, setNewManagerId] = useState("");

    const getRoleName = (user) =>
        typeof user.role === "string" ? user.role : user.role?.name;

    // ================= FETCH USERS =================
    const fetchUsers = async () => {
        try {
            const response = await fetch(`${API}/admin/users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Failed to fetch users");

            const data = await response.json();
            console.log("Fetched users:", data);
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // ================= FILTER LOGIC =================
    const filteredUsers = users.filter((user) =>
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase())
    );

    const managers = filteredUsers.filter(
        (user) => getRoleName(user) === "ROLE_MANAGER"
    );

    const employees = filteredUsers.filter(
        (user) => getRoleName(user) === "ROLE_EMPLOYEE"
    );

    // ================= TOGGLE STATUS =================
    const toggleUserStatus = async (userId) => {
        try {
            const response = await fetch(`${API}/admin/users/${userId}/toggle`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Failed to update user");

            await fetchUsers();
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Failed to update user");
        }
    };

    // ================= CREATE USER =================
    const handleCreateUser = async () => {
        try {
            if (!newUser.name || !newUser.email || !newUser.password) {
                alert("Please fill all required fields");
                return;
            }

            if (newUser.role === "ROLE_EMPLOYEE" && !newUser.managerId) {
                alert("Please select a manager for the employee");
                return;
            }

            const roleId = newUser.role === "ROLE_MANAGER" ? 2 : 3;

            const body = {
                name: newUser.name,
                email: newUser.email,
                password: newUser.password,
                roleId,
                managerId: newUser.role === "ROLE_EMPLOYEE"
                    ? Number(newUser.managerId)
                    : null,
            };

            console.log("Creating user with body:", body);

            const response = await fetch(`${API}/admin/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                let errorMessage = "Failed to create user";
                try {
                    const errData = await response.json();
                    errorMessage = errData.message || errData.error || JSON.stringify(errData);
                } catch {
                    try {
                        errorMessage = await response.text();
                    } catch {
                        errorMessage = "Failed to create user";
                    }
                }
                alert(errorMessage);
                return;
            }

            alert("User Created Successfully");

            setNewUser({
                name: "",
                email: "",
                password: "",
                role: "ROLE_EMPLOYEE",
                managerId: ""
            });

            await fetchUsers();
        } catch (error) {
            console.error("Create user error:", error);
            alert("Something went wrong while creating user");
        }
    };

    // ================= REASSIGN MANAGER =================
    const confirmReassignment = async () => {
        if (!newManagerId) {
            alert("Please select a new manager");
            return;
        }

        try {
            const response = await fetch(
                `${API}/users/deactivate-manager?managerId=${selectedManager.id}&newManagerId=${newManagerId}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                alert("Failed to reassign employees and deactivate manager");
                return;
            }

            setShowReassignModal(false);
            setNewManagerId("");
            setSelectedManager(null);
            await fetchUsers();
        } catch (error) {
            console.error("Reassignment error:", error);
            alert("Error during reassignment");
        }
    };

    const confirmToggle = async () => {
        if (!selectedUser) return;

        await toggleUserStatus(selectedUser.id);
        setShowModal(false);
        setSelectedUser(null);
    };

    return (
        <>
            <div className="d-flex justify-content-end mb-3">
                <button
                    className="btn btn-primary me-2"
                    onClick={() =>
                        setNewUser({
                            name: "",
                            email: "",
                            password: "",
                            role: "ROLE_MANAGER",
                            managerId: ""
                        })
                    }
                >
                    + Create Manager
                </button>

                <button
                    className="btn btn-success"
                    onClick={() =>
                        setNewUser({
                            name: "",
                            email: "",
                            password: "",
                            role: "ROLE_EMPLOYEE",
                            managerId: ""
                        })
                    }
                >
                    + Create Employee
                </button>
            </div>

            {showReassignModal && (
                <div
                    className="modal fade show d-block"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content shadow">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Reassign Employees Before Deactivation
                                </h5>
                                <button
                                    className="btn-close"
                                    onClick={() => setShowReassignModal(false)}
                                />
                            </div>

                            <div className="modal-body">
                                <p>
                                    You are about to deactivate:
                                    <strong> {selectedManager?.name}</strong>
                                </p>

                                <hr />

                                <h6>Affected Employees ({managerEmployees.length})</h6>

                                <ul className="mb-3">
                                    {managerEmployees.map((emp) => (
                                        <li key={emp.id}>{emp.name}</li>
                                    ))}
                                </ul>

                                <label className="form-label">Select New Manager</label>

                                <select
                                    className="form-select"
                                    value={newManagerId}
                                    onChange={(e) => setNewManagerId(e.target.value)}
                                >
                                    <option value="">Choose Manager</option>
                                    {managers
                                        .filter((m) => m.id !== selectedManager?.id && m.active)
                                        .map((m) => (
                                            <option key={m.id} value={m.id}>
                                                {m.name}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowReassignModal(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="btn btn-danger"
                                    onClick={confirmReassignment}
                                >
                                    Confirm & Deactivate
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showModal && (
                <div
                    className="modal fade show d-block"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content shadow">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Confirm {selectedUser?.active ? "Deactivation" : "Activation"}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setShowModal(false);
                                        setSelectedUser(null);
                                    }}
                                />
                            </div>

                            <div className="modal-body">
                                <p>
                                    Are you sure you want to{" "}
                                    <strong>
                                        {selectedUser?.active ? "deactivate" : "activate"}
                                    </strong>{" "}
                                    this user?
                                </p>

                                {selectedUser?.active && (
                                    <p className="text-danger mb-0">
                                        This will disable their system access.
                                    </p>
                                )}
                            </div>

                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setShowModal(false);
                                        setSelectedUser(null);
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    className={`btn ${selectedUser?.active ? "btn-danger" : "btn-success"}`}
                                    onClick={confirmToggle}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="container-fluid">
                <div className="card shadow-sm p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h2 className="mb-0">User Management</h2>
                            <span className="text-muted">
                                Total Users: {managers.length + employees.length}
                            </span>
                        </div>

                        <div style={{ width: "250px" }}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search users..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="card shadow-sm p-3 mb-4">
                        <h5>Create User</h5>

                        <div className="row g-2">
                            <div className="col">
                                <input
                                    className="form-control"
                                    placeholder="Name"
                                    value={newUser.name}
                                    onChange={(e) =>
                                        setNewUser({ ...newUser, name: e.target.value })
                                    }
                                />
                            </div>

                            <div className="col">
                                <input
                                    className="form-control"
                                    placeholder="Email"
                                    value={newUser.email}
                                    onChange={(e) =>
                                        setNewUser({ ...newUser, email: e.target.value })
                                    }
                                />
                            </div>

                            <div className="col">
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Password"
                                    value={newUser.password}
                                    onChange={(e) =>
                                        setNewUser({ ...newUser, password: e.target.value })
                                    }
                                />
                            </div>

                            <div className="col">
                                <select
                                    className="form-select"
                                    value={newUser.role}
                                    onChange={(e) =>
                                        setNewUser({ ...newUser, role: e.target.value, managerId: "" })
                                    }
                                >
                                    <option value="ROLE_MANAGER">Manager</option>
                                    <option value="ROLE_EMPLOYEE">Employee</option>
                                </select>
                            </div>

                            {newUser.role === "ROLE_EMPLOYEE" && (
                                <div className="col">
                                    <select
                                        className="form-select"
                                        value={newUser.managerId}
                                        onChange={(e) =>
                                            setNewUser({ ...newUser, managerId: e.target.value })
                                        }
                                    >
                                        <option value="">Select Manager</option>
                                        {managers
                                            .filter((m) => m.active)
                                            .map((m) => (
                                                <option key={m.id} value={m.id}>
                                                    {m.name}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            )}

                            <div className="col">
                                <button
                                    className="btn btn-primary w-100"
                                    onClick={handleCreateUser}
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    </div>

                    <h4 className="mt-3">Managers ({managers.length})</h4>
                    <div className="card shadow-sm p-3 mb-4">
                        <table className="table table-hover align-middle">
                            <thead className="table-primary">
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {managers.length > 0 ? (
                                    managers.map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <span className={`badge ${user.active ? "bg-success" : "bg-danger"}`}>
                                                    {user.active ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <button
                                                    disabled={user.email === currentEmail}
                                                    className={`btn btn-sm ${user.active ? "btn-outline-danger" : "btn-outline-success"}`}
                                                    onClick={async () => {
                                                        if (!user.active) {
                                                            setSelectedUser(user);
                                                            setShowModal(true);
                                                            return;
                                                        }

                                                        setSelectedManager(user);

                                                        try {
                                                            const res = await fetch(
                                                                `${API}/users/manager/${user.id}/employees`,
                                                                {
                                                                    headers: {
                                                                        Authorization: `Bearer ${token}`,
                                                                    },
                                                                }
                                                            );

                                                            const data = await res.json();
                                                            setManagerEmployees(data);
                                                            setShowReassignModal(true);
                                                        } catch (err) {
                                                            console.error("Error fetching employees:", err);
                                                        }
                                                    }}
                                                >
                                                    {user.active ? "Deactivate" : "Activate"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center text-muted">
                                            No managers found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <h4>Employees ({employees.length})</h4>
                    <div className="card shadow-sm p-3">
                        <table className="table table-hover align-middle">
                            <thead className="table-success">
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.length > 0 ? (
                                    employees.map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <span className={`badge ${user.active ? "bg-success" : "bg-danger"}`}>
                                                    {user.active ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <button
                                                    disabled={user.email === currentEmail}
                                                    className={`btn btn-sm ${user.active ? "btn-outline-danger" : "btn-outline-success"}`}
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowModal(true);
                                                    }}
                                                >
                                                    {user.active ? "Deactivate" : "Activate"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center text-muted">
                                            No employees found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminUsers;