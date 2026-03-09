import { useState } from "react";
import { FaUserCircle, FaKey } from "react-icons/fa";

function Profile() {

    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");
    const API = import.meta.env.VITE_API_URL;

    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const changePassword = async () => {

        if (!currentPassword || !newPassword || !confirmPassword) {
            alert("Please fill all fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {

            const response = await fetch(
                `${API}/users/change-password`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        currentPassword,
                        newPassword
                    })
                }
            );

            const message = await response.text();
            alert(message);

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setShowPasswordForm(false);

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container">

            <h2 className="mb-4">My Profile</h2>

            <div className="card shadow-sm p-4" style={{ maxWidth: "600px" }}>

                <div className="text-center mb-4">
                    <FaUserCircle size={70} color="#4e73df" />
                    <h4 className="mt-2">{name}</h4>
                    <p className="text-muted mb-1">{email}</p>
                    <span className="badge bg-primary">
                        {role?.replace("ROLE_", "")}
                    </span>
                </div>

                <hr />

                <h5 className="mb-3">Account Information</h5>

                <p><strong>Name:</strong> {name}</p>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Role:</strong> {role?.replace("ROLE_", "")}</p>

                <hr />

                {!showPasswordForm && (
                    <button
                        className="btn btn-outline-primary"
                        onClick={() => setShowPasswordForm(true)}
                    >
                        <FaKey className="me-2"/>
                        Change Password
                    </button>
                )}

                {showPasswordForm && (
                    <>
                        <h5 className="mt-3 mb-3">Change Password</h5>

                        <div className="mb-3">
                            <label className="form-label">Current Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">New Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <div className="d-flex gap-2">
                            <button
                                className="btn btn-primary"
                                onClick={changePassword}
                            >
                                Update Password
                            </button>

                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowPasswordForm(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </>
                )}

            </div>

        </div>
    );
}

export default Profile;