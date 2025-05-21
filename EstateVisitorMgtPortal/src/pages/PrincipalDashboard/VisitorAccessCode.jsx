import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const VisitorAccessCode = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [records, setRecords] = useState([]);

  const generateVisitorCode = () => {
    const code = '7' + Math.floor(100000 + Math.random() * 900000).toString().substring(1);
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + 2 * 60 * 60 * 1000); // 2 hours later

    const newRecord = {
      id: Date.now(),
      phone: phoneNumber,
      code,
      createdAt,
      expiresAt,
      status: 'Valid'
    };

    setRecords(prev => [...prev, newRecord]);
    setPhoneNumber('');
  };

  const updateStatuses = () => {
    const now = new Date();
    const updated = records.map(r => {
      if (r.status === 'Used') return r;
      if (now > new Date(r.expiresAt)) return { ...r, status: 'Expired' };
      return { ...r, status: 'Valid' };
    });
    setRecords(updated);
  };

  useEffect(() => {
    const timer = setInterval(updateStatuses, 60 * 1000); // Check every minute
    return () => clearInterval(timer);
  }, [records]);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
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
    const newCode = '7' + Math.floor(100000 + Math.random() * 900000).toString().substring(1);
    const now = new Date();
    const newExpiry = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const updatedRecord = {
      ...record,
      code: newCode,
      createdAt: now,
      expiresAt: newExpiry,
      status: 'Valid'
    };
    setRecords(prev =>
      prev.map(r => (r.id === record.id ? updatedRecord : r))
    );
  };

  const markAsUsed = (id) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: 'Used' } : r));
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
                <td>{new Date(r.createdAt).toLocaleString()}</td>
                <td>{new Date(r.expiresAt).toLocaleString()}</td>
                <td>
                  <span
                    className={`badge ${
                      r.status === 'Valid' ? 'bg-success' :
                      r.status === 'Used' ? 'bg-secondary' : 'bg-danger'
                    }`}
                  >
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
            <tr>
              <td colSpan="6" className="text-center">No access codes generated yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VisitorAccessCode;
