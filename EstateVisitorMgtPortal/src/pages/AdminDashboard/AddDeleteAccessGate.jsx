import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddDeleteAccessGate = () => {
  const [streets, setStreets] = useState([]);
  const [selectedStreet, setSelectedStreet] = useState('');
  const [accessGateInput, setAccessGateInput] = useState('');
  const [accessGates, setAccessGates] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const API = 'http://127.0.0.1:8000/api'; // adjust as needed
  const API_URL = 'http://127.0.0.1:8000/api/streets'; // adjust as needed
  // Fetch streets and access gates on load
  useEffect(() => {
    fetchStreets();
    fetchAccessGates();
  }, []);

  const fetchStreets = async () => {
    try {
      const res = await axios.get(API_URL);
      setStreets(res.data);
    } catch (err) {
      console.error('Error fetching streets:', err);
    }
  };

  const fetchAccessGates = async () => {
    try {
      const res = await axios.get(`${API}/access-gates`);
      console.log ('get all access gates',res);
      setAccessGates(res.data);
    } catch (err) {
      console.error('Error fetching access gates:', err);
    }
  };

  const handleAddGate = async () => {
    if (selectedStreet && accessGateInput) {
      const payload = {
        street_id: selectedStreet,
        gate_name: accessGateInput,
      };
      console.log('access gate payload', payload);
      try {
        await axios.post(`${API}/access-gate`, payload);
        fetchAccessGates(); // refresh list
        clearForm();
      } catch (err) {
        console.error('Error adding access gate:', err);
      }
    }
  };

  const handleEdit = (gate) => {
   
    setSelectedStreet(gate.street_id);
    setAccessGateInput(gate.gate);
    setEditingId(gate.id);
  };

  const handleUpdateGate = async () => {
    try {
      const payload = {
        street_id: selectedStreet,
        gate_name: accessGateInput,
      };
      console.log('update payload', payload);
      await axios.put(`${API}/access-gate/${editingId}`, payload);
      fetchAccessGates();
      clearForm();
    } catch (err) {
      console.error('Error updating access gate:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this gate?')) {
      try {
        await axios.delete(`${API}/access-gate/${id}`);
        fetchAccessGates();
        if (editingId === id) clearForm();
      } catch (err) {
        console.error('Error deleting access gate:', err);
      }
    }
  };

  const clearForm = () => {
    setSelectedStreet('');
    setAccessGateInput('');
    setEditingId(null);
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3 text-primary">Add/Delete Access Gate</h4>

      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <label className="form-label">Estate Street</label>
          <select className="form-select" value={selectedStreet} onChange={e => setSelectedStreet(e.target.value)}>
            <option value="">Select Street</option>
            {streets.map(street => (
  <option key={street.id} value={street.id}>
    {street.name}
  </option>
))}

          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Access Gate</label>
          <input
            type="text"
            className="form-control"
            value={accessGateInput}
            onChange={e => setAccessGateInput(e.target.value)}
            placeholder="Enter Access Gate"
            disabled={!selectedStreet}
          />
        </div>
      </div>

      <div className="mb-4">
        {editingId ? (
          <div>
            <button className="btn btn-success me-2" onClick={handleUpdateGate}>Update Gate</button>
            <button className="btn btn-secondary" onClick={clearForm}>Cancel</button>
          </div>
        ) : (
          <button className="btn btn-primary" onClick={handleAddGate} disabled={!accessGateInput || !selectedStreet}>Add Gate</button>
        )}
      </div>

      <h5>Access Gates</h5>
      <table className="table table-bordered bg-white">
        <thead className="table-light">
          <tr>
            <th>Street</th>
            <th>Gate</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {accessGates.length > 0 ? (
            accessGates.map(g => (
              <tr key={g.id}>
                <td>{g.street}</td>
                <td>{g.gate}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(g)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(g.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">No access gates found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AddDeleteAccessGate;
