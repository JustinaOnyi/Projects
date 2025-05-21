import React, { useState, useEffect, useMemo } from 'react';

const sampleData = [
  {
    id: 1,
    name: 'John Doe',
    phoneNumber: '08012345678',
    category: 'Visitor',
    houseAddress: '12 Green St',
    dateValidated: '2025-05-15',
    accessCodeStatus: 'Granted',
    accessCodeGiver: 'Mr. A',
  },
  {
    id: 2,
    name: 'Jane Smith',
    phoneNumber: '08098765432',
    category: 'Dependant',
    houseAddress: '5 Blue Rd',
    dateValidated: '2025-05-16',
    accessCodeStatus: 'Denied',
    accessCodeGiver: 'Mrs. B',
  },
  // Add more sample objects here or fetch real data via API
  // For demonstration, duplicate entries to test pagination
  ...Array.from({ length: 50 }, (_, i) => ({
    id: i + 3,
    name: `User ${i + 3}`,
    phoneNumber: `080000000${i + 3}`,
    category: i % 2 === 0 ? 'Visitor' : 'Dependant',
    houseAddress: `${i + 3} Random St`,
    dateValidated: '2025-05-10',
    accessCodeStatus: i % 2 === 0 ? 'Granted' : 'Denied',
    accessCodeGiver: `Mr. ${i % 3 === 0 ? 'A' : 'B'}`,
  })),
];

function exportToCSV(data) {
  const csvRows = [];
  const headers = [
    'Name',
    'PhoneNumber',
    'Category',
    'HouseAddress',
    'DateValidated',
    'AccessCodeStatus',
    'AccessCodeGiver',
  ];
  csvRows.push(headers.join(','));

  data.forEach((row) => {
    const values = headers.map((header) => {
      const val = row[header.charAt(0).toLowerCase() + header.slice(1)];
      return `"${val}"`; // quote values to handle commas
    });
    csvRows.push(values.join(','));
  });

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', 'validate_report.csv');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

const PAGE_SIZE = 10;

const ValidateReport = () => {
  const [data, setData] = useState(sampleData);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lower = searchTerm.toLowerCase();
    return data.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(lower)
      )
    );
  }, [searchTerm, data]);

  // Sort filtered data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      // Handle dates
      if (sortConfig.key === 'dateValidated') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      } else {
        // String comparison case-insensitive
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredData, sortConfig]);

  // Pagination slice
  const pageCount = Math.ceil(sortedData.length / PAGE_SIZE);
  const currentPageData = sortedData.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Change sorting on header click
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Change page handler
  const goToPage = (page) => {
    if (page < 1 || page > pageCount) return;
    setCurrentPage(page);
  };

  // Reset to first page when search or sorting changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortConfig]);

  const renderSortArrow = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽';
  };

  return (
    <div className="container mt-4">
      <h3>Validate Report</h3>

      <div className="d-flex justify-content-between mb-3 flex-wrap gap-2">
        <input
          type="text"
          className="form-control me-3"
          style={{ maxWidth: '300px' }}
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="btn btn-success"
          onClick={() => exportToCSV(sortedData)}
          disabled={sortedData.length === 0}
        >
          Export to CSV
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="table table-striped table-bordered">
          <thead className="table-primary">
            <tr>
              <th
                style={{ cursor: 'pointer' }}
                onClick={() => handleSort('name')}
              >
                Name{renderSortArrow('name')}
              </th>
              <th
                style={{ cursor: 'pointer' }}
                onClick={() => handleSort('phoneNumber')}
              >
                Phone Number{renderSortArrow('phoneNumber')}
              </th>
              <th
                style={{ cursor: 'pointer' }}
                onClick={() => handleSort('category')}
              >
                Category{renderSortArrow('category')}
              </th>
              <th
                style={{ cursor: 'pointer' }}
                onClick={() => handleSort('houseAddress')}
              >
                House Address{renderSortArrow('houseAddress')}
              </th>
              <th
                style={{ cursor: 'pointer' }}
                onClick={() => handleSort('dateValidated')}
              >
                Date Validated{renderSortArrow('dateValidated')}
              </th>
              <th
                style={{ cursor: 'pointer' }}
                onClick={() => handleSort('accessCodeStatus')}
              >
                Access Code Status{renderSortArrow('accessCodeStatus')}
              </th>
              <th
                style={{ cursor: 'pointer' }}
                onClick={() => handleSort('accessCodeGiver')}
              >
                Access Code Giver{renderSortArrow('accessCodeGiver')}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.length > 0 ? (
              currentPageData.map((row) => (
                <tr key={row.id}>
                  <td>{row.name}</td>
                  <td>{row.phoneNumber}</td>
                  <td>{row.category}</td>
                  <td>{row.houseAddress}</td>
                  <td>{row.dateValidated}</td>
                  <td>{row.accessCodeStatus}</td>
                  <td>{row.accessCodeGiver}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-center flex-wrap">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => goToPage(currentPage - 1)}>
              Previous
            </button>
          </li>
          {Array.from({ length: pageCount }, (_, i) => (
            <li
              key={i + 1}
              className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
            >
              <button className="page-link" onClick={() => goToPage(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === pageCount ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => goToPage(currentPage + 1)}>
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default ValidateReport;
