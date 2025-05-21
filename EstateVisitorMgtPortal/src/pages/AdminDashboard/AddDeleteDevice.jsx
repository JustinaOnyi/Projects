import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddDeleteDevice = () => {
  const [devices, setDevices] = useState([
    { id: 1, macAddress: '00:1B:44:11:3A:B7' },
    { id: 2, macAddress: '00:1B:44:11:3A:B8' }
  ]);
  
  const [macAddress, setMacAddress] = useState('');
  const [editItem, setEditItem] = useState(null);

  // Simple MAC address validation (accepts formats like 00:1B:44:11:3A:B7 or 00-1B-44-11-3A-B7)
  const isValidMac = (mac) => {
    const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    return macRegex.test(mac);
  };

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    const trimmedMac = macAddress.trim();
    if (!trimmedMac) return alert('Please enter a MAC address');
    if (!isValidMac(trimmedMac)) return alert('Invalid MAC address format');

    if (editItem) {
      setDevices(prev =>
        prev.map(dev =>
          dev.id === editItem.id ? { ...dev, macAddress: trimmedMac } : dev
        )
      );
      setEditItem(null);
    } else {
      // Prevent duplicates
      if (devices.some(dev => dev.macAddress.toLowerCase() === trimmedMac.toLowerCase())) {
        return alert('This MAC address already exists');
      }
      const newDevice = {
        id: Date.now(),
        macAddress: trimmedMac
      };
      setDevices(prev => [...prev, newDevice]);
    }

    setMacAddress('');
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setMacAddress(item.macAddress);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this MAC address?')) {
      setDevices(prev => prev.filter(dev => dev.id !== id));
      if (editItem && editItem.id === id) {
        setEditItem(null);
        setMacAddress('');
      }
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
                <td>{dev.macAddress}</td>
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
