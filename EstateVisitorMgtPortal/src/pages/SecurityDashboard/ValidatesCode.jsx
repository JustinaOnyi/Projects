// ValidateCode.js
import React, { useState } from 'react';
import swal from 'sweetalert';

const ValidateCode = () => {
  const [codeValue, setCodeValue] = useState('');
  const isCodeValidFormat = /^\d{6}$/.test(codeValue);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isCodeValidFormat) {
      swal('Invalid Format', 'Code must be exactly 6 digits (0-9)', 'warning').then(() => {
        setCodeValue('');
      });
      return;
    }

    const isValid = codeValue.startsWith('7') || codeValue.startsWith('8');

    if (isValid) {
      swal('Access Granted', 'Allow Entry', 'success').then(() => {
        setCodeValue('');
      });
    } else {
      swal('Access Denied', 'Invalid or expired code', 'error').then(() => {
        setCodeValue('');
      });
    }
  };

  return (
    <div className="text-center">
      <h6>Welcome to the Security Dashboard</h6>
      <p>Enter a visitor or dependant access code to validate access.</p>

      <div className="card shadow-sm p-4 mt-4 mx-auto" style={{ maxWidth: '400px' }}>
        <h5 className="mb-3">Validate Access Code</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label htmlFor="code" className="form-label">Access Code</label>
            <input
              type="text"
              name="code"
              id="code"
              className="form-control"
              placeholder="Enter 6-digit code"
              value={codeValue}
              onChange={(e) => setCodeValue(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={!isCodeValidFormat}>
            Validate Code
          </button>
        </form>
      </div>
    </div>
  );
};

export default ValidateCode;
