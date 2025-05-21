import React, { useState } from 'react';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';

const role = 'admin';

const AddDeleteDependants = () => {
  const stateUserMap = {
    Lagos: ['Justina', 'Tunde'],
    Abuja: ['Amaka', 'John'],
  };

  const userCategoryMap = {
    Justina: ['Residential', 'Commercial'],
    Tunde: ['Industrial'],
    Amaka: ['Service'],
    John: ['Business', 'Retail']
  };

  const [data, setData] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [dependant, setDependant] = useState('');
  const [editItem, setEditItem] = useState(null);

  const getUsers = () => {
    return selectedState
      ? stateUserMap[selectedState.value].map(user => ({ label: user, value: user }))
      : [];
  };

  const getCategories = () => {
    return selectedUser
      ? userCategoryMap[selectedUser.value].map(cat => ({ label: cat, value: cat }))
      : [];
  };

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    if (!selectedState || !selectedUser || !selectedCategory || !dependant.trim()) return;

    const newItem = {
      id: editItem ? editItem.id : Date.now(),
      state: selectedState.value,
      user: selectedUser.value,
      category: selectedCategory.value,
      dependant: dependant.trim(),
    };

    if (editItem) {
      setData(prev => prev.map(item => item.id === editItem.id ? newItem : item));
      setEditItem(null);
    } else {
      setData(prev => [...prev, newItem]);
    }

    // Reset
    setSelectedState(null);
    setSelectedUser(null);
    setSelectedCategory(null);
    setDependant('');
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setSelectedState({ label: item.state, value: item.state });
    setSelectedUser({ label: item.user, value: item.user });
    setSelectedCategory({ label: item.category, value: item.category });
    setDependant(item.dependant);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this record?')) {
      setData(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="text-primary mb-4">Add/Delete Dependants</h4>

      <form onSubmit={handleAddOrUpdate} className="row g-3">
        <div className="col-md-3">
          <label className="form-label">State</label>
          <Select
            value={selectedState}
            onChange={(val) => {
              setSelectedState(val);
              setSelectedUser(null);
              setSelectedCategory(null);
              setDependant('');
            }}
            options={Object.keys(stateUserMap).map(state => ({ label: state, value: state }))}
            placeholder="Select State"
            isClearable
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">User</label>
          <Select
            value={selectedUser}
            onChange={(val) => {
              setSelectedUser(val);
              setSelectedCategory(null);
              setDependant('');
            }}
            options={getUsers()}
            isDisabled={!selectedState}
            placeholder="Select User"
            isClearable
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">Category</label>
          <Select
            value={selectedCategory}
            onChange={(val) => {
              setSelectedCategory(val);
              setDependant('');
            }}
            options={getCategories()}
            isDisabled={!selectedUser}
            placeholder="Select Category"
            isClearable
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">Dependant</label>
          <input
            type="text"
            className="form-control"
            value={dependant}
            onChange={(e) => setDependant(e.target.value)}
            placeholder="Enter dependant"
            disabled={!selectedCategory}
            required
          />
        </div>

        {/* <div className="col-12">
          <button type="submit" className="btn btn-primary">
            {editItem ? 'Update' : 'Add'}
          </button>
        </div> */}
        <div className="col-12">
  <button type="submit" className="btn btn-primary" disabled={role === 'admin'}>
    {editItem ? 'Update' : 'Add'}
  </button>
  {role === 'admin' && <small className="text-danger ms-2">Admins can only delete</small>}
</div>

      </form>

      <hr />

      <h5>Saved Dependants</h5>
      <table className="table table-bordered table-striped">
        <thead className="table-light">
          <tr>
            <th>State</th>
            <th>User</th>
            <th>Category</th>
            <th>Dependant</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map(item => (
              <tr key={item.id}>
                <td>{item.state}</td>
                <td>{item.user}</td>
                <td>{item.category}</td>
                <td>{item.dependant}</td>
                <td>
                  {/* <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(item)}>
                    Edit
                  </button> */}
                  {role !== 'admin' && (
                        <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(item)}>
                            Edit
                        </button>
                        )}

                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="5" className="text-center">No data found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AddDeleteDependants;
