import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios'; // Make sure axios is imported

const LoginPage = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        phone,
        password,
      });
  
      const user = response.data.user;
  console.log("login details", user);
      // Store user in localStorage or context
      localStorage.setItem('user', JSON.stringify(user));
  
      // Redirect based on role
      if (user.role === 'Admin') navigate('/admin');
      else if (user.role === 'Security') navigate('/security');
      else if (user.role === 'Super Admin') navigate('/superadmin');
      else if (user.role === 'Principal User') navigate('/principal');
      else navigate('/login');
  
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.response?.data?.message || 'Something went wrong.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        {/* Left side */}
        <div className="col-md-6 d-flex flex-column justify-content-between bg-primary text-white p-5">
          {/* Logo and name */}
          <div className="d-flex align-items-center mb-4">
            <img
              src="https://via.placeholder.com/40"
              alt="Logo"
              className="me-2"
            />
            <h2 className="m-0">Visitrack</h2>
          </div>

          {/* Center icon */}
          <div className="d-flex justify-content-center align-items-center flex-grow-1">
            <i className="fas fa-building fa-7x"></i>
          </div>

          {/* Footer */}
          <footer className="text-center mt-4">
            <p className="mb-0">&copy; 2025 Visitrack</p>
            <p className="mb-0">Support: +234 800 000 0000</p>
          </footer>
        </div>

        {/* Right side (Login form) */}
        <div className="col-md-6 d-flex align-items-center justify-content-center bg-light">
          <form
            onSubmit={handleSubmit}
            className="p-4 shadow rounded bg-white"
            style={{ width: '100%', maxWidth: '400px' }}
          >
            <h3 className="text-center mb-4">Login</h3>
            <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="fas fa-phone"></i></span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="08012345678"
                    value={phone}
                    maxLength={11}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
           
            <div className="mb-3">
                <label className="form-label">5-Digit Password</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="fas fa-lock"></i></span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="*****"
                    value={password}
                    maxLength={5}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                id="rememberMe"
              />
              <label className="form-check-label" htmlFor="rememberMe">
                Remember me
              </label>
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>

            <div className="mt-3 text-center">
  <span>Don't have an account? </span>
  <a href="/signup" className="text-primary" style={{ textDecoration: 'none' }}>
    Sign Up
  </a>
</div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
