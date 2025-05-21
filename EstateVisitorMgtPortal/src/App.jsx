import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import SecurityDashboard from "./pages/SecurityDashboard/SecurityDashboard";
import PrincipalDashboard from "./pages/PrincipalDashboard/PrincipalDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard/SuperAdminDashboard";
import Login from "./pages/login";
import SignupPage from './pages/signup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/security/*" element={<SecurityDashboard />} />
        <Route path="/principal/*" element={<PrincipalDashboard />} />
        <Route path="/superadmin/*" element={<SuperAdminDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<Navigate to="/admin" />} />
      </Routes>
    </Router>
  );
}

export default App;
