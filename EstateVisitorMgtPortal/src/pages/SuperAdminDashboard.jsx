import React from "react";
import { Routes, Route, Link } from "react-router-dom";

const SuperAdminDashboard = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold mb-4">Super Admin Dashboard</h1>
    <nav className="mb-4">
      <Link className="mr-4" to="admin">Admin Control</Link>
      <Link className="mr-4" to="reporting">Reporting</Link>
      <Link className="mr-4" to="settings">Settings</Link>
      <Link to="estate">Estate Registration</Link>
    </nav>
    <Routes>
      <Route path="admin" element={<div>Admin Creation & Control</div>} />
      <Route path="reporting" element={<div>All Reports</div>} />
      <Route path="settings" element={<div>Create Admins</div>} />
      <Route path="estate" element={<div>Estate Registration & Activation</div>} />
    </Routes>
  </div>
);

export default SuperAdminDashboard;