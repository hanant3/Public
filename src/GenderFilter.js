// GenderFilter.js
import React from 'react';

const GenderFilter = ({ onFilterChange }) => {
  const handleFilterChange = (e) => {
    const selectedGender = e.target.value;
    onFilterChange(selectedGender);
  };

  return (
    <div>
      <label htmlFor="genderFilter">Filter by Gender:</label>
      <select id="genderFilter" onChange={handleFilterChange}>
        <option value="">All Genders</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        {/* Add other gender options as needed */}
      </select>
    </div>
  );
};

export default GenderFilter;
