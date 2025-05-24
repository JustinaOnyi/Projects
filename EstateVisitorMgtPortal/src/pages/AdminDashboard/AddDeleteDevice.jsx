import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'http://127.0.0.1:8000/api/mac-devices'; // replace with actual URL


const AddDeleteDevice = () => {
  const [devices, setDevices] = useState([]);
  const [macAddress, setMacAddress] = useState('');
  const [editItem, setEditItem] = useState(null);

  const isValidMac = (mac) => {
    const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    return macRegex.test(mac);
  };

  const fetchDevices = async () => {
    try {
      const res = await axios.get(API_URL);
      setDevices(res.data);
    } catch (error) {
      console.error('Failed to fetch devices:', error);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    const trimmedMac = macAddress.trim();

    if (!trimmedMac) return alert('Please enter a MAC address');
    if (!isValidMac(trimmedMac)) return alert('Invalid MAC address format');

    try {
      if (editItem) {
        
        await axios.put(`${API_URL}/${editItem.id}`, { mac_address: trimmedMac });
        setEditItem(null);
      } else {
        const exists = devices.some(dev => dev.mac_address.toLowerCase() === trimmedMac.toLowerCase());
        if (exists) return alert('This MAC address already exists');

        await axios.post(API_URL, { mac_address: trimmedMac });
      }

      setMacAddress('');
      fetchDevices();
    } catch (error) {
      console.error('Failed to save device:', error);
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setMacAddress(item.mac_address);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this MAC address?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchDevices();
      if (editItem && editItem.id === id) {
        setEditItem(null);
        setMacAddress('');
      }
    } catch (error) {
      console.error('Failed to delete device:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="text-primary mb-4">Add/Delete MAC Address</h4>

      <form onSubmit={handleAddOrUpdate} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">MAC Address</label>
          <input
            type="text"
            className="form-control"
            value={macAddress}
            onChange={(e) => setMacAddress(e.target.value)}
            placeholder="e.g. 00:1B:44:11:3A:B7"
            required
          />
        </div>

        <div className="col-md-6 d-flex align-items-end">
          <button type="submit" className="btn btn-primary">
            {editItem ? 'Update' : 'Add'}
          </button>
          {editItem && (
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={() => {
                setEditItem(null);
                setMacAddress('');
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <hr />

      <h5>Saved MAC Addresses</h5>
      <table className="table table-bordered table-striped">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>MAC Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {devices.length > 0 ? (
            devices.map((dev, index) => (
              <tr key={dev.id}>
                <td>{index + 1}</td>
                <td>{dev.mac_address}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(dev)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(dev.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="3" className="text-center">No MAC addresses found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AddDeleteDevice;
