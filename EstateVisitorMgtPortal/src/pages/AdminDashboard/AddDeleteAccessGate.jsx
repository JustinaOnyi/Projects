import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddDeleteAccessGate = () => {
  const [states, setStates] = useState(['Lagos', 'Abuja']);
  const [locations, setLocations] = useState([]);
  const [streets, setStreets] = useState([]);
  const [accessGates, setAccessGates] = useState([]);

  const [selectedState, setSelectedState] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedStreet, setSelectedStreet] = useState('');
  const [accessGateInput, setAccessGateInput] = useState('');
  const [editingId, setEditingId] = useState(null);

  const estateData = {
    Lagos: {
      'Lekki Phase 1': ['Admiralty Way', 'Freedom Way'],
      'Ajah': ['Abraham Adesanya', 'Ado Road'],
    },
    Abuja: {
      'Maitama': ['Gana Street', 'Yakubu Gowon Crescent'],
      'Wuse': ['Aminu Kano Crescent', 'Herbert Macaulay Way'],
    },
  };

  useEffect(() => {
    if (selectedState) {
      setLocations(Object.keys(estateData[selectedState]));
      setSelectedLocation('');
      setStreets([]);
      setSelectedStreet('');
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedLocation) {
      setStreets(estateData[selectedState][selectedLocation]);
      setSelectedStreet('');
    }
  }, [selectedLocation]);

  const handleAddGate = () => {
    if (selectedState && selectedLocation && selectedStreet && accessGateInput) {
      setAccessGates(prev => [
        ...prev,
        {
          id: Date.now(),
          state: selectedState,
          location: selectedLocation,
          street: selectedStreet,
          gate: accessGateInput,
        },
      ]);
      clearForm();
    }
  };

  const handleEdit = (gate) => {
    setSelectedState(gate.state);
    setSelectedLocation(gate.location);
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
              state: selectedState,
              location: selectedLocation,
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
    setSelectedState('');
    setSelectedLocation('');
    setSelectedStreet('');
    setAccessGateInput('');
    setEditingId(null);
    setLocations([]);
    setStreets([]);
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3 text-primary">Add/Delete Access Gate</h4>
      
      <div className="row g-3 mb-3">
        <div className="col-md-3">
          <label className="form-label">State</label>
          <select className="form-select" value={selectedState} onChange={e => setSelectedState(e.target.value)}>
            <option value="">Select State</option>
            {states.map(state => <option key={state}>{state}</option>)}
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Estate Location</label>
          <select className="form-select" value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)} disabled={!selectedState}>
            <option value="">Select Location</option>
            {locations.map(loc => <option key={loc}>{loc}</option>)}
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Estate Street</label>
          <select className="form-select" value={selectedStreet} onChange={e => setSelectedStreet(e.target.value)} disabled={!selectedLocation}>
            <option value="">Select Street</option>
            {streets.map(street => <option key={street}>{street}</option>)}
          </select>
        </div>
        <div className="col-md-3">
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
          <button className="btn btn-primary" onClick={handleAddGate} disabled={!accessGateInput}>Add Gate</button>
        )}
      </div>

      <h5>Access Gates</h5>
      <table className="table table-bordered bg-white">
        <thead className="table-light">
          <tr>
            <th>State</th>
            <th>Location</th>
            <th>Street</th>
            <th>Gate</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {accessGates.length > 0 ? (
            accessGates.map(g => (
              <tr key={g.id}>
                <td>{g.state}</td>
                <td>{g.location}</td>
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
              <td colSpan="5" className="text-center">No access gates added.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AddDeleteAccessGate;
