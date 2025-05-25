import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE = 'http://localhost:8000/api'; // Change to your base URL

const VisitorAccessCode = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [records, setRecords] = useState([]);

  // Fetch codes on load
  useEffect(() => {
    axios.get(`${API_BASE}/visitor-access-codes`)
      .then(res => setRecords(res.data))
      .catch(err => console.error('Failed to fetch visitor codes', err));
  }, []);

  const generateVisitorCode = async () => {

    if (!phoneNumber.match(/^0\d{10}$/)) {
        Swal.fire('Invalid Phone', 'Please enter a valid phone number starting with 0', 'warning');
        return;
      }

      try {
        const res = await axios.post(`${API_BASE}/visitor-access-codes`, {
          phone: phoneNumber
        });
    
        const newRecord = {
          id: res.data.id,
          phone: res.data.phone,
          code: res.data.code,
          createdAt: new Date(res.data.created_at),
          expiresAt: new Date(res.data.expires_at),
          status: res.data.status
        };
    
        setRecords(prev => [...prev, newRecord]);
        setPhoneNumber('');
    
        Swal.fire('Success', `Access code ${newRecord.code} created for ${newRecord.phone}`, 'success');
      } catch (err) {
        if (err.response && err.response.status === 409) {
          const existing = err.response.data.code;
          Swal.fire({
            title: 'Code Already Exists',
            html: `
              <p>This phone number already has a valid code:</p>
              <p><strong>${existing.code}</strong></p>
              <p>Expires: ${new Date(existing.expires_at).toLocaleString()}</p>
            `,
            icon: 'info'
          });
        } else {
          console.error(err);
          Swal.fire('Error', 'Something went wrong generating the code.', 'error');
        }
      }
    };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    Swal.fire('Copied!', 'Access code copied to clipboard.', 'info');
  };

  const handleWhatsApp = (phone, code) => {
    const msg = `Your visitor access code is: ${code}. It is valid for 2 hours.`;
    const url = `https://wa.me/234${phone.slice(1)}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const handleSMS = (phone, code) => {
    const body = `sms:${phone}?body=Your visitor access code is: ${code}. Valid for 2 hours.`;
    window.location.href = body;
  };

  const handleRegenerate = (record) => {
    axios.put(`${API_BASE}/visitor-access-codes/${record.id}`, {})
      .then(res => {
        setRecords(prev => prev.map(r => r.id === record.id ? res.data : r));
        Swal.fire('Success', 'Code regenerated', 'success');
      })
      .catch(() => Swal.fire('Error', 'Failed to regenerate code', 'error'));
  };

  const markAsUsed = (id) => {
    axios.put(`${API_BASE}/visitor-access-codes/${id}/used`)
      .then(() => {
        setRecords(prev =>
          prev.map(r => r.id === id ? { ...r, status: 'Used' } : r)
        );
      })
      .catch(() => Swal.fire('Error', 'Failed to mark as used', 'error'));
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-4 text-primary">Visitor Access Code</h4>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <label>Visitor Phone Number</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
          />
        </div>

        <div className="col-md-2 d-flex align-items-end">
          <button
            className="btn btn-success w-100"
            onClick={generateVisitorCode}
            disabled={!phoneNumber.match(/^0\d{10}$/)}
          >
            Generate Code
          </button>
        </div>
      </div>

      <h5 className="mb-3">Generated Visitor Codes</h5>
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Phone Number</th>
            <th>Access Code</th>
            <th>Date Created</th>
            <th>Expiry Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.length > 0 ? (
            records.map(r => (
              <tr key={r.id}>
                <td>{r.phone}</td>
                <td>{r.code}</td>
                <td>{new Date(r.created_at).toLocaleString()}</td>
                <td>{new Date(r.expires_at).toLocaleString()}</td>
                <td>
                  <span className={`badge ${
                    r.status === 'Valid' ? 'bg-success' :
                    r.status === 'Used' ? 'bg-secondary' : 'bg-danger'
                  }`}>
                    {r.status}
                  </span>
                </td>
                <td className="d-flex gap-2 flex-wrap">
                  <button className="btn btn-sm btn-primary" onClick={() => handleCopy(r.code)}>Copy</button>
                  <button className="btn btn-sm btn-success" onClick={() => handleWhatsApp(r.phone, r.code)}>WhatsApp</button>
                  <button className="btn btn-sm btn-secondary" onClick={() => handleSMS(r.phone, r.code)}>SMS</button>
                  <button className="btn btn-sm btn-warning" onClick={() => handleRegenerate(r)}>Regenerate</button>
                  {r.status === 'Valid' && (
                    <button className="btn btn-sm btn-dark" onClick={() => markAsUsed(r.id)}>Mark as Used</button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="6" className="text-center">No access codes generated yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VisitorAccessCode;
