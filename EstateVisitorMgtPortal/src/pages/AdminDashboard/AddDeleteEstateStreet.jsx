import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddDeleteEstateStreet = () => {
  const [data, setData] = useState([
    {
      id: 1,
      state: 'Lagos',
      location: 'Lekki',
      street: 'Admiralty Way',
    },
    {
      id: 2,
      state: 'Abuja',
      location: 'Gwarinpa',
      street: '1st Avenue',
    }
  ]);

  const stateLocationMap = {
    Lagos: ['Lekki', 'Ikeja', 'Yaba'],
    Abuja: ['Gwarinpa', 'Maitama'],
  };

  const locationStreetMap = {
    Lekki: ['Admiralty Way', 'Lekki Phase 1'],
    Ikeja: ['Allen Avenue', 'Opebi Road'],
    Yaba: ['Herbert Macaulay Way'],
    Gwarinpa: ['1st Avenue', '3rd Avenue'],
    Maitama: ['Asokoro Road'],
  };

  const [selectedState, setSelectedState] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedStreet, setSelectedStreet] = useState('');
  const [editItem, setEditItem] = useState(null);

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    if (!selectedState || !selectedLocation || !selectedStreet) return;

    if (editItem) {
      // Update
      setData(prev =>
        prev.map(item =>
          item.id === editItem.id
            ? { ...item, state: selectedState, location: selectedLocation, street: selectedStreet }
            : item
        )
      );
      setEditItem(null);
    } else {
      // Add
      const newItem = {
        id: Date.now(),
        state: selectedState,
        location: selectedLocation,
        street: selectedStreet,
      };
      setData(prev => [...prev, newItem]);
    }

    setSelectedState('');
    setSelectedLocation('');
    setSelectedStreet('');
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setSelectedState(item.state);
    setSelectedLocation(item.location);
    setSelectedStreet(item.street);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this record?')) {
      setData(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="text-primary mb-4">Add/Delete Estate Street</h4>

      <form onSubmit={handleAddOrUpdate} className="row g-3">
        <div className="col-md-4">
          <label className="form-label">State</label>
          <select
            className="form-select"
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setSelectedLocation('');
              setSelectedStreet('');
            }}
            required
          >
            <option value="">Select State</option>
            {Object.keys(stateLocationMap).map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Estate Location</label>
          <select
            className="form-select"
            value={selectedLocation}
            onChange={(e) => {
              setSelectedLocation(e.target.value);
              setSelectedStreet('');
            }}
            disabled={!selectedState}
            required
          >
            <option value="">Select Location</option>
            {selectedState && stateLocationMap[selectedState].map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>

        {/* <div className="col-md-4">
          <label className="form-label">Estate Street</label>
          <select
            className="form-select"
            value={selectedStreet}
            onChange={(e) => setSelectedStreet(e.target.value)}
            disabled={!selectedLocation}
            required
          >
            <option value="">Select Street</option>
            {selectedLocation && locationStreetMap[selectedLocation].map(street => (
              <option key={street} value={street}>{street}</option>
            ))}
          </select>
        </div> */}

            <div className="col-md-4">
            <label className="form-label">Estate Street</label>
            <input
                type="text"
                className="form-control"
                value={selectedStreet}
                onChange={(e) => setSelectedStreet(e.target.value)}
                placeholder="Enter Estate Street"
                disabled={!selectedLocation}
                required
            />
            </div>


        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            {editItem ? 'Update' : 'Add'}
          </button>
        </div>
      </form>

      <hr />

      <h5>Saved Estate Streets</h5>
      <table className="table table-bordered table-striped">
        <thead className="table-light">
          <tr>
            <th>State</th>
            <th>Location</th>
            <th>Street</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map(item => (
              <tr key={item.id}>
                <td>{item.state}</td>
                <td>{item.location}</td>
                <td>{item.street}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(item)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="4" className="text-center">No data found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AddDeleteEstateStreet;
