function DashboardCards({ data = {}, role }) {
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
                           <h3>{data.totalUsers || 0}</h3>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card shadow-sm p-3 text-center">
                            <h6>Managers</h6>
                            <h3 className="text-primary">{data.totalManagers || 0}</h3>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card shadow-sm p-3 text-center">
                            <h6>Employees</h6>
                            <h3 className="text-success">{data.totalEmployees || 0}</h3>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card shadow-sm p-3 text-center">
                            <h6>Inactive Users</h6>
                            <h3 className="text-danger">{data.inactiveUsers || 0}</h3>
                        </div>
                    </div>
                </div>
            )}

            {/* TASK STATS — For Everyone */}
            <div className="row g-4">
                <StatCard title="Total Tasks" value={data.totalTasks || 0} />
                <StatCard title="Pending" value={data.pending || 0} color="text-warning" />
                <StatCard title="In Progress" value={data.inProgress || 0} color="text-primary" />
                <StatCard title="Submitted" value={data.submitted || 0} color="text-info" />
                <StatCard title="Approved" value={data.approved || 0} color="text-success" />
                <StatCard title="Rejected" value={data.rejected || 0} color="text-danger" />
            </div>
        </div>
    );
}

function StatCard({ title, value, color = "" }) {

    const iconMap = {
        "Total Tasks": "bi-list-task",
        "Pending": "bi-hourglass-split",
        "In Progress": "bi-lightning-charge",
        "Submitted": "bi-upload",
        "Approved": "bi-check-circle",
        "Rejected": "bi-x-circle",
    };

    return (
        <div className="col-6 col-md-4 col-lg-2">
            <div className="card shadow-sm p-3 text-center">
                <i className={`bi ${iconMap[title]} fs-3 mb-2`}></i>
                <h6>{title}</h6>
                <h3 className={color}>{value}</h3>
            </div>
        </div>
    );

}

export default DashboardCards;