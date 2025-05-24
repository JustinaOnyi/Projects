import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';

const AddDeleteUsers = () => {
  const [users, setUsers] = useState([]);
    const [states, setStates] = useState([]);

  // useEffect(() => {
  //   const fetchStates = async () => {
  //     try {
  //       const response = await fetch('http://localhost:8000/api/states'); // Replace with your actual API
  //       const data = await response.json();
  //       setStates(data);
  //     } catch (error) {
  //       console.error('Failed to fetch states:', error);
  //     }
  //   };
  
  //   fetchStates();
  // }, []);

  const API_URL = 'http://127.0.0.1:8000/api/users';

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/states');
        const data = await response.json();
        setStates(data);
      } catch (error) {
        console.error('Failed to fetch states:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        // const response = await fetch('http://localhost:8000/api/users');
        // const data = await response.json();
        const res = await axios.get(API_URL);
     
        setUsers(res.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchStates();
    fetchUsers();
  }, []);




  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    stateId: '',
    address: '',
    phone: '',
    street: '',
    streetNumber: ''
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

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
    //user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  // const deleteUser = id => {
  //   if (window.confirm('Are you sure you want to delete this user?')) {
  //     setUsers(prev => prev.filter(user => user.id !== id));
  //   }
  // };

  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await fetch(`http://localhost:8000/api/users/${id}`, { method: 'DELETE' });
        setUsers(prev => prev.filter(user => user.id !== id));
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };




  const handleBulkUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const lines = text.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
      const newUsers = lines.slice(1).map(line => {
        const values = line.split(',').map(val => val.trim());
        const user = {};
        headers.forEach((header, index) => {
          user[header] = values[index] || '';
        });
  
        return {
          id: Date.now() + Math.random(), // Ensure unique ID
          name: user.name || '',
          email: user.email || '',
          role: user.role || '',
          category: user.category || '',
          address: user.address || '',
          phone: user.phone || '',
          registeredby: 'bulkUpload'
        };
      });
  

      try {
        const response = await fetch('http://localhost:8000/api/users/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ users: newUsers })
        });
        const result = await response.json();
        setUsers(prev => [...prev, ...result]);
      } catch (error) {
        console.error('Bulk upload failed:', error);
      }
    };

    reader.readAsText(file);
  };

    
  

  const handleUserFormSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const role = form.role.value;
   // const category = form.category.value;
    const phone = form.phone.value;
    const stateId = form.stateId.value;

    let address = form.address?.value || '';
    let street = '';
    let streetNumber = '';
  
    if (role === 'Principal User') {
      street = form.street.value;
      streetNumber = form.streetNumber.value;
      address = `${street} ${streetNumber}`; // Optional: combine if you still need a full address
    }
  
    const newUser = {
      id: currentUser?.id || Date.now(),
      name,
      email,
      role,
      stateId,
      address,
      street,
      streetNumber,
      phone,
      registeredby: currentUser ? currentUser.registeredby : 'form',
    };
  
    // if (currentUser) {
    //   setUsers(prev =>
    //     prev.map(user => (user.id === currentUser.id ? { ...user, ...newUser } : user))
    //   );
    // } else {
    //   setUsers(prev => [...prev, newUser]);
    // }
  
    try {
      if (currentUser)  {
        await axios.put(`${API_URL}/${currentUser.id}`, newUser, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setUsers(prev => prev.map(user => user.id === currentUser.id ? { ...user, ...newUser } : user));
      } else {
         
        console.log("creating users", newUser);
        const response = await axios.post(API_URL, newUser, {
          headers: {
            'Content-Type': 'application/json'
          }
      });
     
        const createdUser = await response.data;
        setUsers(prev => [...prev, createdUser]);
      }
    } catch (error) {
      console.error('Failed to save user:', error);
    }
    setShowModal(false);
    setCurrentUser(null);
  };
  
  

  // const openModal = (user = null) => {
  //   setCurrentUser(user);
  //   setShowModal(true);
  // };

  const openModal = (user = null) => {
    setCurrentUser(user);
    setSelectedRole(user?.role || '');
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

      {/* <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-2">
        <input
          type="text"
          className="form-control w-50 w-md-50"
          placeholder="Search users..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-outline-primary" onClick={exportToCSV}>
          <i className="fas fa-file-export me-2"></i>Export CSV
        </button>
      </div> */}

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-2">
          <input
            type="text"
            className="form-control w-100 w-md-25"
            placeholder="Search users..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />

          <div className="d-flex gap-2">
            {/* <input
              type="file"
              accept=".csv"
              className="form-control form-control-sm"
              onChange={handleBulkUpload}
              title="Upload CSV"
            /> */}

          <div className="input-group input-group-sm">
            <label className="input-group-text bg-warning" htmlFor="csvUpload">Upload CSV</label>
            <input
              type="file"
              id="csvUpload"
              accept=".csv"
              className="form-control btn btn-outline-warning"
              onChange={handleBulkUpload}
            />
          </div>
            <button className="btn btn-outline-primary" onClick={exportToCSV}>
              <i className="fas fa-file-export me-2"></i>Export CSV
            </button>
          </div>
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
              {/* <th onClick={() => sortUsers('role')}>
                Role {sortDirection.field === 'role' && (sortDirection.direction === 'asc' ? '↓' : '↑')}
              </th> */}
              {!users.some(u => u.role === 'principal') && (
                <th onClick={() => sortUsers('role')}>
                  Role {sortDirection.field === 'role' && (sortDirection.direction === 'asc' ? '↓' : '↑')}
                </th>
              )}
              <th onClick={() => sortUsers('address')}>
                Address {sortDirection.field === 'address' && (sortDirection.direction === 'asc' ? '↓' : '↑')}
              </th>
              <th onClick={() => sortUsers('phone')}>
                Phone {sortDirection.field === 'phone' && (sortDirection.direction === 'asc' ? '↓' : '↑')}
              </th>
              {/* <th onClick={() => sortUsers('category')}>
               Category {sortDirection.field === 'category' && (sortDirection.direction === 'asc' ? '↓' : '↑')}
              </th> */}
              {/* <th>Registered By</th> */}
              <th style={{ width: '120px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  {/* <td>{user.role}</td> */}
                  {user.role !== 'principal' && <td>{user.role}</td>}
                  <td>{user.address}</td>
                  <td>{user.phone}</td>
                  {/* <td>{user.category}</td> */}
                  {/* <td>{user.registeredby}</td> */}
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
      {/* <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex="-1" aria-hidden="true">
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

             
                {(currentUser?.role !== 'principal') && (
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
                )}

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
</div> */}

      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleUserFormSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">{currentUser ? 'Edit User' : 'Add User'}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">

                  {/* Name, Email, etc. */}
                  <input name="name" className="form-control mb-2" defaultValue={currentUser?.name} required placeholder="Full Name" />
                  <input name="email" className="form-control mb-2" defaultValue={currentUser?.email} required placeholder="Email" />
                  
                  <select name="role" className="form-control mb-2" defaultValue={currentUser?.role} required onChange={(e) => setSelectedRole(e.target.value)}>
                    <option value="">Select Role</option>
                    <option value="Admin">Admin</option>
                    <option value="Security">Security</option>
                    <option value="Principal User">Principal User</option>
                  </select>

    
                    <select
                      className="form-select"
                      name="stateId"
                      value={formData.stateId}
                      onChange={e => setFormData({ ...formData, stateId: e.target.value })}
                      required
                    >
                      <option value="">Select State</option>
                      {states.map(state => (
                        <option key={state.id} value={state.id}>{state.state_name}</option>
                      ))}
                    </select>
               
                  {/* Conditionally show/hide fields */}
                  {selectedRole === 'Principal User' ? (
                    <>
                      <select name="street" className="form-control mb-2" required>
                        <option value="">Select Street</option>
                        <option value="Street A">Street A</option>
                        <option value="Street B">Street B</option>
                        {/* Replace with dynamic list if available */}
                      </select>
                      <input name="streetNumber" className="form-control mb-2" placeholder="Street Number" required />
                    </>
                  ) : (
                    <input name="address" className="form-control mb-2" defaultValue={currentUser?.address} placeholder="Address" required />
                  )}

                  <input name="phone" className="form-control mb-2" defaultValue={currentUser?.phone} placeholder="Phone Number" required />
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">Save</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}


</div>
);
};

export default AddDeleteUsers;
