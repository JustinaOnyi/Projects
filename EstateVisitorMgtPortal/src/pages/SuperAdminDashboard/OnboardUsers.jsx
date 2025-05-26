import React, { useEffect, useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE = 'http://localhost:8000/api';

const OnboardUsers = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    role: '',
    password: '',
    confirmPassword: ''
  });

  const fetchUsers = async () => {
    const res = await axios.get(`${API_BASE}/onboard-users`);
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return swal('Error', 'Passwords do not match', 'error');
    }

    try {
      await axios.post(`${API_BASE}/onboard-users`, form);
      swal('Success', 'User created successfully', 'success');
      setForm({ name: '', phone: '', role: '', password: '', confirmPassword: '' });
      fetchUsers();
    } catch (err) {
      swal('Error', err.response?.data?.message || 'Failed to create user', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      await axios.delete(`${API_BASE}/onboard-users/${id}`);
      fetchUsers();
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Onboard New User</h4>
      <form onSubmit={handleSubmit} className="row g-3 mb-5">
        <div className="col-md-4">
          <input type="text" name="name" className="form-control" placeholder="Name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="col-md-4">
          <input type="text" name="phone" className="form-control" placeholder="Phone" value={form.phone} onChange={handleChange} required />
        </div>
        <div className="col-md-4">
          <select name="role" className="form-select" value={form.role} onChange={handleChange} required>
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Principal User">Principal</option>
            <option value="Security">Security</option>
          </select>
        </div>
        <div className="col-md-4">
          <input type="password" name="password" className="form-control" placeholder="New Password" value={form.password} onChange={handleChange} required />
        </div>
        <div className="col-md-4">
          <input type="password" name="confirmPassword" className="form-control" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required />
        </div>
        <div className="col-md-4">
          <button type="submit" className="btn btn-primary w-100">Create User</button>
        </div>
      </form>

      <h5>User List</h5>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Password</th>
            <th>Expires At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.phone}</td>
              <td>{u.role}</td>
              <td>******</td>
              <td>{u.expires_at}</td>
              <td>
                {/* You can expand this to open modal for editing */}
                <button onClick={() => handleDelete(u.id)} className="btn btn-sm btn-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OnboardUsers;
