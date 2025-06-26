import { useEffect, useState } from "react";
import { getDashboard } from "../services/DashboardService.js";

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
        </div>
    );
}
