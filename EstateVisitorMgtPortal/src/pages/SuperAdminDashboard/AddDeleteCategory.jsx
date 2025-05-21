import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddDeleteCategory = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Residential' },
    { id: 2, name: 'Commercial' }
  ]);
  
  const [categoryName, setCategoryName] = useState('');
  const [editItem, setEditItem] = useState(null);

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    if (editItem) {
      setCategories(prev =>
        prev.map(cat =>
          cat.id === editItem.id ? { ...cat, name: categoryName.trim() } : cat
        )
      );
      setEditItem(null);
    } else {
      const newCategory = {
        id: Date.now(),
        name: categoryName.trim()
      };
      setCategories(prev => [...prev, newCategory]);
    }

    setCategoryName('');
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setCategoryName(item.name);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this category?')) {
      setCategories(prev => prev.filter(cat => cat.id !== id));
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="text-primary mb-4">Add/Delete Category</h4>

      <form onSubmit={handleAddOrUpdate} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Category Name</label>
          <input
            type="text"
            className="form-control"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter Category Name"
            required
          />
        </div>

        <div className="col-md-6 d-flex align-items-end">
          <button type="submit" className="btn btn-primary">
            {editItem ? 'Update' : 'Add'}
          </button>
        </div>
      </form>

      <hr />

      <h5>Saved Categories</h5>
      <table className="table table-bordered table-striped">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Category Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 ? (
            categories.map((cat, index) => (
              <tr key={cat.id}>
                <td>{index + 1}</td>
                <td>{cat.name}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(cat)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(cat.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="3" className="text-center">No categories found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AddDeleteCategory;
