import React, { useState, useEffect, useRef } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

// SearchableDropdown component (reusable for State and Location)
const SearchableDropdown = ({ label, options, value, onChange, disabled }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const containerRef = useRef(null);

  const filteredOptions = (options || []).filter((opt) =>
    typeof opt === "string" &&
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

 
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowOptions(false);
        setSearchTerm(value || "");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);

  useEffect(() => {
    setSearchTerm(value || "");
  }, [value]);

  return (
    <div className="mb-3 position-relative" ref={containerRef}>
      <label className="form-label">{label}</label>
      <input
        type="text"
        className="form-control"
        disabled={disabled}
        value={searchTerm}
        placeholder={`Select ${label.toLowerCase()}...`}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setShowOptions(true);
        }}
        onFocus={() => setShowOptions(true)}
        autoComplete="off"
      />
      {showOptions && filteredOptions.length > 0 && (
        <ul
          className="list-group position-absolute"
          style={{
            zIndex: 1000,
            maxHeight: "150px",
            overflowY: "auto",
            width: "100%",
          }}
        >
          {filteredOptions.map((opt, i) => (
            <li
              key={i}
              className="list-group-item list-group-item-action"
              style={{ cursor: "pointer" }}
              onClick={() => {
                onChange(opt);
                setShowOptions(false);
                setSearchTerm(opt);
              }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
      {showOptions && filteredOptions.length === 0 && (
        <div
          className="border rounded bg-white p-2 position-absolute"
          style={{ zIndex: 1000, width: "100%" }}
        >
          No options found
        </div>
      )}
    </div>
  );
};

// Helper to export CSV from data array
const exportToCSV = (data, filename = "estates.csv") => {
  if (data.length === 0) {
    alert("No data to export");
    return;
  }
  const csvRows = [];
  // headers
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(","));
  // rows
  data.forEach((row) => {
    const values = headers.map((h) => `"${(row[h] ?? "").toString().replace(/"/g, '""')}"`);
    csvRows.push(values.join(","));
  });
  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("hidden", "");
  a.setAttribute("href", url);
  a.setAttribute("download", filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const RegisterEstate = () => {
  // Sample states and locations data
//   const statesData = [
//     { id: 1, name: "Lagos", locations: ["Ikeja", "Lekki", "Surulere"] },
//     { id: 2, name: "Abuja", locations: ["Gwarinpa", "Wuse", "Maitama"] },
//     { id: 3, name: "Rivers", locations: ["Port Harcourt", "Obio-Akpor", "Bonny"] },
//   ];

  // Estates list state
//   const [estates, setEstates] = useState([]);

//   // Form states
//   const [selectedState, setSelectedState] = useState("");
//   const [locationOptions, setLocationOptions] = useState([]);
//   const [selectedLocation, setSelectedLocation] = useState("");
//   const [estateName, setEstateName] = useState("");
//   const [dateRegistered, setDateRegistered] = useState("");
//   const [paymentDate, setPaymentDate] = useState("");

const [estates, setEstates] = useState([]); // ✅ MUST be declared before useEffect
const [selectedState, setSelectedState] = useState("");
const [locationOptions, setLocationOptions] = useState([]);
const [selectedLocation, setSelectedLocation] = useState("");
const [estateName, setEstateName] = useState("");
const [dateRegistered, setDateRegistered] = useState("");
const [paymentDate, setPaymentDate] = useState("");
const [editingEstateId, setEditingEstateId] = useState(null);
const [searchTerm, setSearchTerm] = useState("");

  // Edit mode
//   const [editingEstateId, setEditingEstateId] = useState(null);

  // Table search/filter
  //const [searchTerm, setSearchTerm] = useState("");

  // Update location options when state changes
  

  // Reset form fields
  const resetForm = () => {
    setSelectedState("");
    setSelectedLocation("");
    setEstateName("");
    setDateRegistered("");
    setPaymentDate("");
    setEditingEstateId(null);
  };

  // Handle form submit for Add or Edit
//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!selectedState || !selectedLocation || !estateName || !dateRegistered || !paymentDate) {
//       alert("Please fill all fields");
//       return;
//     }

//     if (editingEstateId !== null) {
//       // Edit existing estate
//       setEstates((prev) =>
//         prev.map((est) =>
//           est.id === editingEstateId
//             ? {
//                 ...est,
//                 state: selectedState,
//                 location: selectedLocation,
//                 estateName,
//                 dateRegistered,
//                 paymentDate,
//               }
//             : est
//         )
//       );
//       alert("Estate updated successfully!");
//     } else {
//       // Add new estate
//       const newEstate = {
//         id: Date.now(),
//         state: selectedState,
//         location: selectedLocation,
//         estateName,
//         dateRegistered,
//         paymentDate,
//         active: true,
//       };
//       setEstates((prev) => [newEstate, ...prev]);
//       alert("Estate added successfully!");
//     }

//     resetForm();
//   };

  // Handle edit click
  const handleEdit = (estate) => {
    setEditingEstateId(estate.id);
    setSelectedState(estate.state);
    setSelectedLocation(estate.location);
    setEstateName(estate.estateName);
    setDateRegistered(estate.dateRegistered);
    setPaymentDate(estate.paymentDate);
  };

  // Handle deactivate/activate toggle
  const handleToggleActive = (id) => {
    setEstates((prev) =>
      prev.map((est) =>
        est.id === id ? { ...est, active: !est.active } : est
      )
    );
  };

  // Handle delete estate
//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this estate?")) {
//       setEstates((prev) => prev.filter((est) => est.id !== id));
//     }
//   };

const [statesData, setStatesData] = useState([]);

useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get(`${API_BASE}/states`);
        setStatesData(response.data);
      } catch (error) {
        console.error("Failed to fetch states", error);
      }
    };
    fetchStates();
  }, []);

  useEffect(() => {
    const fetchEstates = async () => {
      try {
        const response = await axios.get(`${API_BASE}/estates`);
        setEstates(response.data);
      } catch (error) {
        console.error("Failed to fetch estates", error);
      }
    };
    fetchEstates();
  }, []);

  useEffect(() => {
    if (selectedState) {
      const state = statesData.find((s) => s.name === selectedState);
      setLocationOptions(state ? state.locations : []);
      setSelectedLocation("");
    } else {
      setLocationOptions([]);
      setSelectedLocation("");
    }
  }, [selectedState]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const payload = {
      state: selectedState,
      location: selectedLocation,
      estate_name: estateName,
      date_registered: dateRegistered,
      payment_date: paymentDate,
    };
  
    try {
      if (editingEstateId !== null) {
        await axios.put(`${API_BASE}/estates/${editingEstateId}`, payload);
        alert("Estate updated successfully!");
      } else {
        await axios.post(`${API_BASE}/estates`, payload);
        alert("Estate added successfully!");
      }
      resetForm();
      const res = await axios.get(`${API_BASE}/estates`);
      setEstates(res.data);
    } catch (error) {
      console.error("Error submitting form", error);
      alert("An error occurred. Please try again.");
    }
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this estate?")) return;
    try {
      await axios.delete(`${API_BASE}/estates/${id}`);
      setEstates(estates.filter((est) => est.id !== id));
    } catch (error) {
      console.error("Error deleting estate", error);
      alert("Failed to delete estate.");
    }
  };

  // Filter estates by search term (case-insensitive in estateName, state or location)
  const filteredEstates = estates.filter(
    (e) =>
      e.estateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Register Estate</h3>

      <form
        onSubmit={handleSubmit}
        className="mb-5 border rounded p-4 bg-light"
      >
        <h5>{editingEstateId ? "Edit Estate" : "Add Estate"}</h5>
        <div className="row">
          <div className="col-md-4">
            <SearchableDropdown
              label="State"
            //   options={statesData.map((s) => s.name)}
              options={statesData ? statesData.map((s) => s.name) : []}
              value={selectedState}
              onChange={setSelectedState}
              disabled={false}
            />
          </div>
          <div className="col-md-4">
            <SearchableDropdown
              label="Location"
              options={locationOptions}
              value={selectedLocation}
              onChange={setSelectedLocation}
              disabled={!selectedState}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Estate Name</label>
            <input
              type="text"
              className="form-control"
              value={estateName}
              onChange={(e) => setEstateName(e.target.value)}
              required
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Date Registered</label>
            <input
              type="date"
              className="form-control"
              value={dateRegistered}
              onChange={(e) => setDateRegistered(e.target.value)}
              required
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Payment Date</label>
            <input
              type="date"
              className="form-control"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary me-2">
          {editingEstateId ? "Update Estate" : "Add Estate"}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={resetForm}
          disabled={!editingEstateId}
        >
          Cancel
        </button>
      </form>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          placeholder="Search estates..."
          className="form-control w-50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="btn btn-success"
          onClick={() => exportToCSV(filteredEstates)}
          disabled={filteredEstates.length === 0}
        >
          Export to CSV
        </button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Estate Name</th>
              <th>State</th>
              <th>Location</th>
              <th>Date Registered</th>
              <th>Payment Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEstates.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No estates found.
                </td>
              </tr>
            ) : (
              filteredEstates.map((estate) => (
                <tr key={estate.id}>
                  <td>{estate.estateName}</td>
                  <td>{estate.state}</td>
                  <td>{estate.location}</td>
                  <td>{estate.dateRegistered}</td>
                  <td>{estate.paymentDate}</td>
                  <td>
                    {estate.active ? (
                      <span className="badge bg-success">Active</span>
                    ) : (
                      <span className="badge bg-secondary">Inactive</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => handleEdit(estate)}
                    >
                      Edit
                    </button>
                    <button
                      className={`btn btn-sm ${
                        estate.active ? "btn-warning" : "btn-success"
                      } me-2`}
                      onClick={() => handleToggleActive(estate.id)}
                    >
                      {estate.active ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(estate.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegisterEstate;
