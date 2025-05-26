import React, { useState } from 'react';
import { Link, Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import AddDeleteUsers from './AddDeleteUsers';
import AddDeleteEstateStreet from './AddDeleteEstateStreet';
import AddDeleteAccessGate from './AddDeleteAccessGate';
import AddDeleteDevice from './AddDeleteDevice';
import AddDeleteDependants from './AddDeleteDependants';
import CreateAccessCode from './CreateResetAccessCode';


const DashboardHome = () => {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="text-dark mb-0">
          <i className="fas fa-tachometer-alt me-2 text-primary"></i>
          Admin Dashboard
        </h4>
        <small className="text-muted">Welcome back! Manage your estate system</small>
      </div>

      {/* Dashboard Cards */}
      <div className="row g-4">
        {/* User Management Card */}
        <div className="col-lg-6 col-md-6 col-sm-12">
          <Link to="/admin/add-delete-users" className="text-decoration-none">
            <div className="card h-100 shadow-sm border-0 card-hover">
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <i className="fas fa-users-cog fa-3x text-primary"></i>
                </div>
                <h5 className="card-title text-dark">User Management</h5>
                <p className="card-text text-muted">
                  Add, edit, or remove users from the system. Manage user roles and permissions.
                </p>
                <div className="mt-auto">
                  <span className="btn btn-primary btn-sm">
                    Manage Users <i className="fas fa-arrow-right ms-1"></i>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Estate Registration Card */}
        <div className="col-lg-6 col-md-6 col-sm-12">
          <Link to="/admin/add-delete-device" className="text-decoration-none">
            <div className="card h-100 shadow-sm border-0 card-hover">
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <i className="fas fa-building fa-3x text-success"></i>
                </div>
                <h5 className="card-title text-dark">Add Device</h5>
                <p className="card-text text-muted">
                  Add device details like MAC address.
                </p>
                <div className="mt-auto">
                  <span className="btn btn-success btn-sm">
                    Add Estate Street<i className="fas fa-arrow-right ms-1"></i>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Access Management Card */}
        <div className="col-lg-6 col-md-6 col-sm-12">
          <Link to="/admin/create-accesscode" className="text-decoration-none">
            <div className="card h-100 shadow-sm border-0 card-hover">
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <i className="fas fa-key fa-3x text-warning"></i>
                </div>
                <h5 className="card-title text-dark">Access Code Management</h5>
                <p className="card-text text-muted">
                  Create new access codes or reset existing ones for estate security/principal users.
                </p>
                <div className="mt-auto">
                  <span className="btn btn-warning btn-sm">
                    Manage Access <i className="fas fa-arrow-right ms-1"></i>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Settings Card */}
        <div className="col-lg-6 col-md-6 col-sm-12">
          <Link to="/admin/add-delete-estate-street" className="text-decoration-none">
            <div className="card h-100 shadow-sm border-0 card-hover">
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <i className="fas fa-cog fa-3x text-info"></i>
                </div>
                <h5 className="card-title text-dark">System Settings</h5>
                <p className="card-text text-muted">
                  Configure estate streets, access gates, categories and system preferences.
                </p>
                <div className="mt-auto">
                  <span className="btn btn-info btn-sm">
                    Configure <i className="fas fa-arrow-right ms-1"></i>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="row mt-5">
        <div className="col-12">
          <h5 className="text-dark mb-3">
            <i className="fas fa-chart-bar me-2"></i>
            Quick Overview
          </h5>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Total Users</h6>
                  <h4>1,234</h4>
                </div>
                <i className="fas fa-users fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Active Estates</h6>
                  <h4>87</h4>
                </div>
                <i className="fas fa-building fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Access Codes</h6>
                  <h4>456</h4>
                </div>
                <i className="fas fa-key fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Security Gates</h6>
                  <h4>23</h4>
                </div>
                <i className="fas fa-shield-alt fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .card-hover {
          transition: all 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }
        .card-hover:hover .btn {
          transform: scale(1.05);
        }
      `}</style>
    </>
  );
};





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
          <h5 className="mb-0">Visitrack: EstateName(Dynamic)</h5>
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
                    <Link to="/admin/add-delete-device" className="nav-link text-white">
                      <i className="fas fa-lock me-2"></i>Add/Delete device
                    </Link>
                  </li>
                  {/* <li className="nav-item">
                    <a href="#userReport" className="nav-link text-white">
                      <i className="fas fa-file-alt me-2"></i>Add/delete second principal users
                    </a>
                  </li> */}
                  
                  <li className="nav-item">
                  <Link to="/admin/add-delete-dependants" className="nav-link text-white">
                      <i className="fas fa-lock me-2"></i>Add/Delete dependants
                    </Link>
                  </li>
                </ul>
              </div>
            </li>

            <li className="nav-item mb-2">
              <Link to="/admin/create-accesscode" className="nav-link text-white">
                <i className="fas fa-lock me-2"></i> Create/Reset Access Code
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="#" className="nav-link text-white">
                <i className="fas fa-file-alt me-2"></i> Reporting
              </Link>
            </li>
            
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-grow-1 p-4 bg-light w-100">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="add-delete-users" element={<AddDeleteUsers />} />
            <Route path="add-delete-estate-street" element={<AddDeleteEstateStreet />} />
            <Route path="add-delete-access-gate" element={<AddDeleteAccessGate />} />
            <Route path="add-delete-device" element={<AddDeleteDevice />} />
            <Route path="add-delete-dependants" element={<AddDeleteDependants />} />
            <Route path="create-accesscode" element={<CreateAccessCode />} />
            
          </Routes>
        </main>
      </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
