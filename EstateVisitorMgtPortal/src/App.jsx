import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import SecurityDashboard from "./pages/SecurityDashboard";
import PrincipalDashboard from "./pages/PrincipalDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/security/*" element={<SecurityDashboard />} />
        <Route path="/principal/*" element={<PrincipalDashboard />} />
        <Route path="/superadmin/*" element={<SuperAdminDashboard />} />
        <Route path="*" element={<Navigate to="/admin" />} />
      </Routes>
    </Router>
  );
}

export default App;
