import React, { useState } from 'react';
import { Link, Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import ValidateReport from './ValidatesReport';
import ValidateCode from './ValidatesCode';

const SecurityDashboard = () => {
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
      <header className="bg-light text-dark px-4 py-3 sticky-top d-flex justify-content-between align-items-center w-100">
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
          <h5 className="text-center mb-4">Security Panel</h5>
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <Link to="/security" className="nav-link text-white">
                <i className="fas fa-tachometer-alt me-2"></i> Dashboard
              </Link>
            </li>
          
            <li className="nav-item mb-2">
              <Link to="/security/validate-code" className="nav-link text-white">
                <i className="fas fa-lock me-2"></i> Validates Code
              </Link>
            </li>
            
            <li className="nav-item mb-2">
              <Link to="/security/validate-report" className="nav-link text-white">
                <i className="fas fa-file-alt me-2"></i> Validates Report
              </Link>
            </li>
            
          </ul>
        </aside>

        {/* Main Content */}
      <main className="flex-grow-1 d-flex justify-content-center align-items-center w-100" style={{ backgroundColor: '#bfbfbf', minHeight: '80vh' }}>
        {/* <div className="text-center">
          <h6>Welcome to the Security Dashboard</h6>
          <p>Enter a visitor or dependant access code to validate access.</p>
          
          <div className="card shadow-sm p-4 mt-4 mx-auto" style={{ maxWidth: '400px' }}>
            <h5 className="mb-3">Validate Access Code</h5>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();

                      if (!isCodeValidFormat) {
                        swal('Invalid Format', 'Code must be exactly 6 digits (0-9)', 'warning').then(() => {
                          setCodeValue('');
                        });
                        return;
                      }

                      const isValid = codeValue.startsWith('7') || codeValue.startsWith('8');

                      if (isValid) {
                        swal('Access Granted', 'Allow Entry', 'success').then(() => {
                          setCodeValue('');
                        });
                      } else {
                        swal('Access Denied', 'Invalid or expired code', 'error').then(() => {
                          setCodeValue('');
                        });
                      }
                    }}
                  >
                    <div className="mb-3 text-start">
                      <label htmlFor="code" className="form-label">Access Code</label>
                      <input
                        type="text"
                        name="code"
                        id="code"
                        className="form-control"
                        placeholder="Enter 6-digit code"
                        value={codeValue}
                        onChange={(e) => setCodeValue(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary w-100" disabled={!isCodeValidFormat}>
                      Validate Code
                    </button>
                  </form>

          </div>
        </div> */}

<Routes>
<Route path="/validate-code" element={<ValidateCode />} />
<Route path="/validate-report" element={<ValidateReport />} />
</Routes>
        
      </main>

      </div>
      </div>
    </div>
  );
};

export default SecurityDashboard;