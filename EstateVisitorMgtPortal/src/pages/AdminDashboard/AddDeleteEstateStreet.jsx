import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddDeleteEstateStreet = () => {
  const [states, setStates] = useState([]);
  const [locations, setLocations] = useState([]);
  const [streets, setStreets] = useState([]);

  const [selectedState, setSelectedState] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedStreet, setSelectedStreet] = useState('');
  const [editItem, setEditItem] = useState(null);

  const API = 'http://127.0.0.1:8000/api';

  useEffect(() => {
    fetchStates();
  }, []);

  useEffect(() => {
    fetchStreets(); // Load all streets on mount
  }, []);

  useEffect(() => {
    if (selectedState) {
      fetchLocations(selectedState);
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedLocation) {
      fetchStreets(selectedLocation);
    } else {
      setStreets([]);
    }
  }, [selectedLocation]);

  const fetchStates = async () => {
    try {
      const res = await axios.get(`${API}/states`);
      console.log ('get all states', res);
      setStates(res.data);
    } catch (err) {
      console.error('Error fetching states:', err);
    }
  };

  const fetchLocations = async (stateId) => {
    try {
      const res = await axios.get(`${API}/locations/${stateId}`);
      setLocations(res.data);
    } catch (err) {
      console.error('Error fetching locations:', err);
    }
  };

  const fetchStreets = async () => {
    try {
      const res = await axios.get(`${API}/streets`);
      console.log('get all streets', res);
      setStreets(res.data);
    } catch (err) {
      console.error('Error fetching streets:', err);
    }
  };


  

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    if (!selectedState || !selectedLocation || !selectedStreet) return;

    // const payload = {
    //   state_id: selectedState,
    //   location_id: selectedLocation,
    //   street: selectedStreet,
    // };
    const payload = {
        state_id: selectedState,
        estate_location_id: selectedLocation,
        name: selectedStreet,
      };
      
console.log('add street payload', payload);
    try {
      if (editItem) {
        await axios.put(`${API}/street/${editItem.id}`, payload);
      } else {
        await axios.post(`${API}/street`, payload);
      }

      setSelectedStreet('');
      setEditItem(null);
      fetchStreets(selectedLocation);
    } catch (err) {
      console.error('Error saving street:', err);
    }
  };

//   const handleEdit = (item) => {
//     setEditItem(item);
//     setSelectedState(item.state_id);
//     setSelectedLocation(item.location_id);
//     setSelectedStreet(item.street);
//   };

const handleEdit = (item) => {
    setEditItem(item);
    setSelectedState(item.state_id);
    setSelectedLocation(item.estate_location_id);
    setSelectedStreet(item.name); // use 'name' not 'street'
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Delete this record?')) {
      try {
        await axios.delete(`${API}/street/${id}`);
        fetchStreets(selectedLocation);
      } catch (err) {
        console.error('Error deleting street:', err);
      }
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
             // setStreets([]);
            }}
            required
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state.id} value={state.id}>{state.state_name}</option>
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
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>{loc.location_name}</option>
            ))}
          </select>
        </div>

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
          {streets.length > 0 ? (
            streets.map(item => (
              <tr key={item.id}>
                <td>{item.state_name}</td>
                <td>{item.location_name}</td>
                <td>{item.name}</td>
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
