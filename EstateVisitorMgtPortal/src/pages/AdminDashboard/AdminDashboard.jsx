import React, { useState } from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import AddDeleteUsers from './AddDeleteUsers';
import AddDeleteEstateStreet from './AddDeleteEstateStreet';
import AddDeleteAccessGate from './AddDeleteAccessGate';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add logout logic here
    alert('Logged out successfully!');
    navigate('/login');
  };

  return (
    <div className="w-100" style={{ width: '100vw', overflowX: 'hidden' }}>
    <div className="d-flex flex-column min-vh-100 w-100">
      {/* Sticky Header */}
      <header className="bg-dark text-white px-4 py-3 sticky-top d-flex justify-content-between align-items-center w-100">
        <div className="d-flex align-items-center">
          <i className="fas fa-city fa-lg me-2 text-warning"></i>
          <h5 className="mb-0">EstatePro Admin</h5>
        </div>
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn btn-outline-light d-md-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className="fas fa-bars"></i>
          </button>
          <button className="btn btn-sm btn-outline-warning" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt me-2"></i> Logout
          </button>
        </div>
      </header>

      {/* Main Body: Sidebar + Content */}
      <div className="d-flex flex-grow-1 w-100">
        {/* Sidebar */}
        <aside
          className={`bg-primary text-white p-3 ${
            sidebarOpen ? 'd-block' : 'd-none'
          } d-md-block`}
          style={{ width: '250px', minHeight: '100%' }}
        >
          <h5 className="text-center mb-4">Admin Panel</h5>
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <Link to="/admin" className="nav-link text-white">
                <i className="fas fa-tachometer-alt me-2"></i> Dashboard
              </Link>
            </li>
            <li className="nav-item mb-2">
              <a
                className="nav-link text-white d-flex justify-content-between align-items-center"
                data-bs-toggle="collapse"
                href="#userManagementMenu"
                role="button"
                aria-expanded="false"
                aria-controls="userManagementMenu"
              >
                <span>
                  <i className="fas fa-users-cog me-2"></i> User Management
                </span>
                <i className="fas fa-chevron-down"></i>
              </a>
              <div className="collapse ps-3" id="userManagementMenu">
                <ul className="nav flex-column">
                  <li className="nav-item">
                    <Link to="/admin/add-delete-users" className="nav-link text-white">
                      <i className="fas fa-user-plus me-2"></i> Add/Delete Users
                    </Link>
                  </li>
                  <li className="nav-item">
                    <a href="#userReport" className="nav-link text-white">
                      <i className="fas fa-file-alt me-2"></i> Users Report
                    </a>
                  </li>
                </ul>
              </div>
            </li>

            <li className="nav-item mb-2">
              <a
                className="nav-link text-white d-flex justify-content-between align-items-center"
                data-bs-toggle="collapse"
                href="#settingsManagementMenu"
                role="button"
                aria-expanded="false"
                aria-controls="settingsManagementMenu"
              >
                <span>
                  <i className="fas fa-wrench me-2"></i> Settings
                </span>
                <i className="fas fa-chevron-down"></i>
              </a>
              <div className="collapse ps-3" id="settingsManagementMenu">
                <ul className="nav flex-column">
                  <li className="nav-item">
                    <Link to="/admin/add-delete-estate-street" className="nav-link text-white">
                      <i className="fas fa-user-plus me-2"></i>Add/delete estate street
                    </Link>
                  </li>
                  <li className="nav-item">
                    
                    <Link to="/admin/add-delete-access-gate" className="nav-link text-white">
                      <i className="fas fa-lock me-2"></i>Define number of access gates
                    </Link>
                  </li>
                  <li className="nav-item">
                    <a href="#userReport" className="nav-link text-white">
                      <i className="fas fa-file-alt me-2"></i>Add/delete category
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="#userReport" className="nav-link text-white">
                      <i className="fas fa-file-alt me-2"></i>Add/delete second principal users
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="#userReport" className="nav-link text-white">
                      <i className="fas fa-user me-2"></i>Delete dependent
                    </a>
                  </li>
                </ul>
              </div>
            </li>

            <li className="nav-item mb-2">
              <Link to="#" className="nav-link text-white">
                <i className="fas fa-file-alt me-2"></i> Reporting
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="#" className="nav-link text-white">
                <i className="fas fa-lock me-2"></i> Create/Reset Access Code
              </Link>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-grow-1 p-4 bg-light w-100">
          <Routes>
            <Route
              path="/admin"
              element={
                <>
                  <h6>Welcome to the Admin Dashboard</h6>
                  <p>Select a menu option to continue.</p>
                </>
              }
            />
            <Route path="add-delete-users" element={<AddDeleteUsers />} />
            <Route path="add-delete-estate-street" element={<AddDeleteEstateStreet />} />
            <Route path="add-delete-access-gate" element={<AddDeleteAccessGate />} />
          </Routes>
        </main>
      </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
