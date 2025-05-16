import React from "react";
import { Routes, Route, Link } from "react-router-dom";

const SecurityDashboard = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold mb-4">Security Dashboard</h1>
    <nav className="mb-4">
      <Link className="mr-4" to="validate-code">Validate Code</Link>
      <Link to="report">Validation Reports</Link>
    </nav>
    <Routes>
      <Route path="validate-code" element={<div>Validate Access Code</div>} />
      <Route path="report" element={<div>Validation Reports</div>} />
    </Routes>
  </div>
);

export default SecurityDashboard;