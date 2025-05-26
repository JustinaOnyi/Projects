import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // Make sure axios is imported


const API_BASE = 'http://localhost:8000/api'; // Change to your base URL
const SignupPage = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Passwords do not match!',
      });
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await axios.post(`${API_BASE}/register-superadmin`, {
        name,
        phone,
        password,
      });
  
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: response.data.message || 'Super Admin registered successfully!',
      }).then(() => {
        navigate('/login');
      });
    } catch (error) {
      const message =
        error.response?.data?.message || 'An error occurred during registration.';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h3 className="text-center mb-4">Sign Up</h3>
      <form onSubmit={handleSignup} className="shadow p-4 bg-white rounded">
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className="form-control"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input
            type="text"
            className="form-control"
            required
            maxLength={11}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="08012345678"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">New Password</label>
          <input
            type="password"
            className="form-control"
            required
            maxLength={5}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="*****"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            required
            maxLength={5}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="*****"
          />
        </div>
        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>

        <div className="mt-3 text-center">
          <span>Already have an account? </span>
          <a href="/login" className="text-primary">Login</a>
        </div>
      </form>
    </div>
  );
};

export default SignupPage;
