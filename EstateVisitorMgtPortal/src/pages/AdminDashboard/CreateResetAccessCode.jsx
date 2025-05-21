import React, { useState } from 'react';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';

const mockPrincipalUsers = [
  { label: 'John Doe', value: 'john', phone: '08012345678' },
  { label: 'Jane Smith', value: 'jane', phone: '08087654321' },
  { label: 'Mike Johnson', value: 'mike', phone: '08123456789' }
];

const generateCode = () => {
  return '8' + Math.floor(100000 + Math.random() * 900000).toString().slice(1);
};

const CreateResetAccessCode = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [records, setRecords] = useState([]);

  const handleGenerateCode = () => {
    if (!selectedUser) return;

    const code = generateCode();
    const newRecord = {
      id: Date.now(),
      user: selectedUser.label,
      phone: selectedUser.phone,
      code,
      generatedAt: new Date()
    };

    setRecords(prev => [...prev, newRecord]);
  };

  const handleResetCode = (record) => {
    const newCode = generateCode();
    const updatedRecord = {
      ...record,
      code: newCode,
      generatedAt: new Date()
    };

    setRecords(prev => prev.map(r => r.id === record.id ? updatedRecord : r));
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
  };

  const handleShareWhatsApp = (phone, code) => {
    const message = `Your access code is: ${code}`;
    const whatsappURL = `https://wa.me/234${phone.slice(1)}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
  };

  const handleSendSMS = (phone, code) => {
    const smsBody = `sms:${phone}?body=Your access code is: ${code}`;
    window.location.href = smsBody;
  };

  return (
    <div className="container mt-4">
      <h4 className="text-primary mb-4">Create/Reset Access Code for Principal Users</h4>

      <div className="row g-3">
        <div className="col-md-4">
          <label>Principal User</label>
          <Select
            options={mockPrincipalUsers}
            onChange={setSelectedUser}
            value={selectedUser}
            placeholder="Select Principal User"
          />
        </div>

        <div className="col-md-2 d-flex align-items-end">
          <button className="btn btn-success w-100" onClick={handleGenerateCode}>
            Generate Code
          </button>
        </div>
      </div>

      <hr />

      <h5>Generated Access Codes</h5>
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Principal User</th>
            <th>Phone Number</th>
            <th>Access Code</th>
            <th>Date Generated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.length > 0 ? records.map(record => (
            <tr key={record.id}>
              <td>{record.user}</td>
              <td>{record.phone}</td>
              <td>{record.code}</td>
              <td>{new Date(record.generatedAt).toLocaleString()}</td>
              <td>
                <div className="d-flex gap-2 flex-wrap">
                  <button className="btn btn-sm btn-warning" onClick={() => handleResetCode(record)}>
                    Reset Code
                  </button>
                  <button className="btn btn-sm btn-primary" onClick={() => handleCopy(record.code)}>
                    Copy
                  </button>
                  <button className="btn btn-sm btn-success" onClick={() => handleShareWhatsApp(record.phone, record.code)}>
                    WhatsApp
                  </button>
                  <button className="btn btn-sm btn-secondary" onClick={() => handleSendSMS(record.phone, record.code)}>
                    SMS
                  </button>
                </div>
              </td>
            </tr>
          )) : (
            <tr><td colSpan="5" className="text-center">No access codes generated yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CreateResetAccessCode;
