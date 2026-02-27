function DashboardCards({ data, role }) {
    return (
        <div className="container-fluid">
            <h2 className="mb-4">
                {role === "ROLE_ADMIN"
                    ? "Admin Dashboard"
                    : role === "ROLE_MANAGER"
                        ? "Manager Dashboard"
                        : "Employee Dashboard"}
            </h2>

            {/* USER STATS — Only Admin */}
            {role === "ROLE_ADMIN" && (
                <div className="row g-4 mb-4">
                    <div className="col-md-3">
                        <div className="card shadow-sm p-3 text-center">
                            <h6>Total Users</h6>
                            <h3>{data.totalUsers}</h3>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card shadow-sm p-3 text-center">
                            <h6>Managers</h6>
                            <h3 className="text-primary">{data.totalManagers}</h3>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card shadow-sm p-3 text-center">
                            <h6>Employees</h6>
                            <h3 className="text-success">{data.totalEmployees}</h3>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card shadow-sm p-3 text-center">
                            <h6>Inactive Users</h6>
                            <h3 className="text-danger">{data.inactiveUsers}</h3>
                        </div>
                    </div>
                </div>
            )}

            {/* TASK STATS — For Everyone */}
            <div className="row g-4">
                <StatCard title="Total Tasks" value={data.totalTasks} />
                <StatCard title="Pending" value={data.pending} color="text-warning" />
                <StatCard title="In Progress" value={data.inProgress} color="text-primary" />
                <StatCard title="Submitted" value={data.submitted} color="text-info" />
                <StatCard title="Approved" value={data.approved} color="text-success" />
                <StatCard title="Rejected" value={data.rejected} color="text-danger" />
            </div>
        </div>
    );
}

function StatCard({ title, value, color = "" }) {
    return (
        <div className="col-md-4">
            <div className="card shadow-sm p-3 text-center">
                <h6>{title}</h6>
                <h3 className={color}>{value}</h3>
            </div>
        </div>
    );
}

export default DashboardCards;