"use client";
import { useEffect, useState } from "react";
import { dashboardAPI } from "../lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    dashboardAPI.getStats()
      .then(setStats)
      .catch(e => setError(e.message));
  }, []);

  return (
    <div className="page">
      <div className="page-title">Dashboard</div>
      {error && <div className="error-msg">{error}</div>}
      {!stats ? (
        <div style={{color:"var(--muted)"}}>Loading stats...</div>
      ) : (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Products</div>
            <div className="stat-value accent">{stats.total_products}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Stock Value</div>
            <div className="stat-value success">₹{Number(stats.total_stock_value).toLocaleString("en-IN", {maximumFractionDigits:2})}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Low Stock Items</div>
            <div className={`stat-value ${stats.low_stock_count > 0 ? "warning" : "success"}`}>{stats.low_stock_count}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Categories</div>
            <div className="stat-value accent">{stats.total_categories}</div>
          </div>
        </div>
      )}
      {stats?.low_stock_count > 0 && (
        <div className="card" style={{borderColor:"rgba(245,158,11,0.4)", background:"rgba(245,158,11,0.05)"}}>
          <div style={{display:"flex", alignItems:"center", gap:"0.5rem", color:"var(--warning)", fontWeight:600}}>
            ⚠️ {stats.low_stock_count} product{stats.low_stock_count !== 1 ? "s are" : " is"} below their low stock threshold. Check the Products page.
          </div>
        </div>
      )}
    </div>
  );
}