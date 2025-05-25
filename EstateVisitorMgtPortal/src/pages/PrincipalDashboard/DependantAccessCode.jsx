import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';

const API_BASE = 'http://localhost:8000/api';

const generateCode = () => {
  return '8' + Math.floor(100000 + Math.random() * 900000).toString().slice(1);
};

const DependantAccessCode = () => {
  const [dependantUsers, setDependantUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [records, setRecords] = useState([]);

  // Fetch dependant users registered by current principal user
  useEffect(() => {
    axios.get(`${API_BASE}/access-codes/users/dependants`)
      .then(res => {
        const options = res.data.map(user => ({
          label: user.name,
          value: user.id,
          phone: user.phone
        }));
        setDependantUsers(options);
      })
      .catch(err => console.error('Failed to load dependant users', err));
  }, []);

  // Fetch existing access codes
  useEffect(() => {
    axios.get(`${API_BASE}/access-codes`)
      .then(response => {
        const formattedRecords = response.data.map(item => ({
          id: item.id,
          user: item.user || 'Unknown',
          phone: item.phone || 'N/A',
          code: item.code,
          generatedAt: item.created_at
        }));
        setRecords(formattedRecords);
      })
      .catch(error => {
        console.error("Failed to load access codes", error);
      });
  }, []);

  const handleGenerateCode = async () => {
    if (!selectedUser) return;

    const existingRecord = records.find(r => r.user === selectedUser.label);
    if (existingRecord) {
      Swal.fire({
        icon: 'info',
        title: 'Access Code Already Exists',
        text: `User "${selectedUser.label}" already has a code. You can reset it if needed.`,
        confirmButtonText: 'OK'
      });
      return;
    }

    const code = generateCode();
    try {
      const response = await axios.post(`${API_BASE}/access-codes`, {
        user_id: selectedUser.value,
        code
      });

      const newRecord = {
        id: response.data.id,
        user: selectedUser.label,
        phone: selectedUser.phone,
        code: response.data.code,
        generatedAt: new Date(response.data.created_at || new Date())
      };

      setRecords(prev => [...prev, newRecord]);
    } catch (err) {
      console.error('Error generating code', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to generate code. Please try again later.'
      });
    }
  };

  const handleResetCode = async (record) => {
    const newCode = generateCode();
    try {
      await axios.put(`${API_BASE}/access-codes/${record.id}`, {
        code: newCode
      });

      const updatedRecord = {
        ...record,
        code: newCode,
        updated_at: new Date()
      };

      setRecords(prev => prev.map(r => r.id === record.id ? updatedRecord : r));
    } catch (err) {
      console.error('Failed to reset code', err);
    }
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
      <h4 className="text-primary mb-4">Create/Reset Access Code for Dependants</h4>

      <div className="row g-3">
        <div className="col-md-4">
          <label>Dependant User</label>
          <Select
            options={dependantUsers}
            onChange={setSelectedUser}
            value={selectedUser}
            placeholder="Select Dependant User"
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
            <th>User</th>
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
                  <button className="btn btn-sm btn-warning" onClick={() => handleResetCode(record)}>Reset</button>
                  <button className="btn btn-sm btn-primary" onClick={() => handleCopy(record.code)}>Copy</button>
                  <button className="btn btn-sm btn-success" onClick={() => handleShareWhatsApp(record.phone, record.code)}>WhatsApp</button>
                  <button className="btn btn-sm btn-secondary" onClick={() => handleSendSMS(record.phone, record.code)}>SMS</button>
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

export default DependantAccessCode;
