import React from "react";
import { Routes, Route, Link } from "react-router-dom";

const PrincipalDashboard = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold mb-4">Principal User Dashboard</h1>
    <nav className="mb-4">
      <Link className="mr-4" to="second-user">Second Principal Users</Link>
      <Link className="mr-4" to="dependents">Manage Dependents</Link>
      <Link to="access-code">Access Code Management</Link>
    </nav>
    <Routes>
      <Route path="second-user" element={<div>Manage Second Principal User</div>} />
      <Route path="dependents" element={<div>Manage Dependents</div>} />
      <Route path="access-code" element={<div>Reset Personal/Dependent Codes</div>} />
    </Routes>
  </div>
);

export default PrincipalDashboard;