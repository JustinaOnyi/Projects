import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddDeleteAccessGate = () => {
  const [streets] = useState([
    'Admiralty Way', 'Freedom Way',
    'Abraham Adesanya', 'Ado Road',
    'Gana Street', 'Yakubu Gowon Crescent',
    'Aminu Kano Crescent', 'Herbert Macaulay Way'
  ]);

  const [selectedStreet, setSelectedStreet] = useState('');
  const [accessGateInput, setAccessGateInput] = useState('');
  const [accessGates, setAccessGates] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const handleAddGate = () => {
    if (selectedStreet && accessGateInput) {
      setAccessGates(prev => [
        ...prev,
        {
          id: Date.now(),
          street: selectedStreet,
          gate: accessGateInput,
        },
      ]);
      clearForm();
    }
  };

  const handleEdit = (gate) => {
    setSelectedStreet(gate.street);
    setAccessGateInput(gate.gate);
    setEditingId(gate.id);
  };

  const handleUpdateGate = () => {
    setAccessGates(prev =>
      prev.map(g =>
        g.id === editingId
          ? {
              ...g,
              street: selectedStreet,
              gate: accessGateInput,
            }
          : g
      )
    );
    clearForm();
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this gate?')) {
      setAccessGates(prev => prev.filter(g => g.id !== id));
      if (editingId === id) clearForm();
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
            {streets.map(street => <option key={street}>{street}</option>)}
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
              <td colSpan="3" className="text-center">No access gates added.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AddDeleteAccessGate;
