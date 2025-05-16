import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const AddDeleteUsers = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Security', category: 'visitor', address: '123 Road', phone: '08012345678' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Admin', category: 'dependent', address: '456 Avenue', phone: '08123456789' },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // Sorting state
  const [sortDirection, setSortDirection] = useState({ field: 'name', direction: 'asc' });

  // Modal state variables
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sorting function
  const sortUsers = (field) => {
    const newDirection = sortDirection.direction === 'asc' ? 'desc' : 'asc';
    const sortedUsers = [...filteredUsers].sort((a, b) => {
      if (a[field] < b[field]) return newDirection === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return newDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setSortDirection({ field, direction: newDirection });
    setUsers(sortedUsers);
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const exportToCSV = () => {
    const csvRows = [
      ['Name', 'Email', 'Role', 'Address', 'Phone'],
      ...filteredUsers.map(user => [user.name, user.email, user.role, user.address, user.phone]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encodedUri;
    link.download = 'users.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const deleteUser = id => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(user => user.id !== id));
    }
  };

  const handleUserFormSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const role = e.target.role.value;
    const category = e.target.category.value;
    const address = e.target.address.value;
    const phone = e.target.phone.value;
  
    if (name && email && role && category && address && phone) {
      if (currentUser) {
        // Edit user
        setUsers(prev =>
          prev.map(user =>
            user.id === currentUser.id
              ? { ...user, name, email, role, category, address, phone }
              : user
          )
        );
      } else {
        // Add new user
        setUsers(prev => [...prev, { id: Date.now(), name, email, role, category, address, phone }]);
      }
      setShowModal(false);
      setCurrentUser(null);
    }
  };
  

  const openModal = (user = null) => {
    setCurrentUser(user);
    setShowModal(true);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-2">
        <h4 className="text-primary">User Management</h4>
        <button className="btn btn-outline-success" onClick={() => openModal()}>
          <i className="fas fa-plus me-2"></i>Add User
        </button>
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-2">
        <input
          type="text"
          className="form-control w-100 w-md-50"
          placeholder="Search users..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-outline-primary" onClick={exportToCSV}>
          <i className="fas fa-file-export me-2"></i>Export CSV
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered bg-white">
          <thead className="table-light">
            <tr>
              <th onClick={() => sortUsers('name')}>
                Name {sortDirection.field === 'name' && (sortDirection.direction === 'asc' ? '↓' : '↑')}
              </th>
              <th onClick={() => sortUsers('email')}>
                Email {sortDirection.field === 'email' && (sortDirection.direction === 'asc' ? '↓' : '↑')}
              </th>
              <th onClick={() => sortUsers('role')}>
                Role {sortDirection.field === 'role' && (sortDirection.direction === 'asc' ? '↓' : '↑')}
              </th>
              <th onClick={() => sortUsers('address')}>
                Address {sortDirection.field === 'address' && (sortDirection.direction === 'asc' ? '↓' : '↑')}
              </th>
              <th onClick={() => sortUsers('phone')}>
                Phone {sortDirection.field === 'phone' && (sortDirection.direction === 'asc' ? '↓' : '↑')}
              </th>
              <th onClick={() => sortUsers('category')}>
               Category {sortDirection.field === 'category' && (sortDirection.direction === 'asc' ? '↓' : '↑')}
              </th>
              <th style={{ width: '120px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.address}</td>
                  <td>{user.phone}</td>
                  <td>{user.category}</td>
                  <td>
                    <button className="btn btn-sm text-warning me-2" onClick={() => openModal(user)}>
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                    <button className="btn btn-sm text-danger" onClick={() => deleteUser(user.id)}>
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center">
        <button className="btn btn-outline-primary" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
        <button className="btn btn-outline-primary" onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}>Next</button>
      </div>

      {/* Modal for Add/Edit User */}
      <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{currentUser ? 'Edit User' : 'Add User'}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowModal(false)}></button>
            </div>
            <form onSubmit={handleUserFormSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input type="text" className="form-control" id="name" defaultValue={currentUser ? currentUser.name : ''} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input type="email" className="form-control" id="email" defaultValue={currentUser ? currentUser.email : ''} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="category" className="form-label">Category</label>
                  <select className="form-select" id="category" defaultValue={currentUser ? currentUser.category : ''} required>
                    <option value="">-- Select Category --</option>
                    <option value="visitor">Visitor</option>
                    <option value="dependent">Dependent</option>
                  </select>
                </div>

              <div className="mb-3">
                <label htmlFor="role" className="form-label">Role</label>
                <select className="form-select" id="role" defaultValue={currentUser ? currentUser.role : ''} required>
                  <option value="">-- Select Role --</option>
                  <option value="admin">Admin</option>
                  <option value="principal user">Principal User</option>
                  <option value="visitor">Visitor</option>
                  <option value="dependent">Dependent</option>
                </select>
              </div>

                <div className="mb-3">
                  <label htmlFor="address" className="form-label">Address</label>
                  <input type="text" className="form-control" id="address" defaultValue={currentUser ? currentUser.address : ''} required />
</div>
<div className="mb-3">
<label htmlFor="phone" className="form-label">Phone</label>
<input type="text" className="form-control" id="phone" defaultValue={currentUser ? currentUser.phone : ''} required />
</div>
</div>
<div className="modal-footer">
<button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
<button type="submit" className="btn btn-primary">{currentUser ? 'Update' : 'Add'}</button>
</div>
</form>
</div>
</div>
</div>
</div>
);
};

export default AddDeleteUsers;
