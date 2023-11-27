import React from 'react';

const AgeFilter = ({ onFilterChange }) => {
  const handleFilterChange = (e) => {
    const selectedAge = e.target.value;
    onFilterChange(selectedAge);
  };

  return (
    <div>
      <label htmlFor="ageFilter">Filter by Age:</label>
      <select id="ageFilter" onChange={handleFilterChange}>
        <option value="">All Ages</option>
        <option value="18-29">18-29</option>
        <option value="30-44">30-44</option>
        <option value="45-60">45-60</option>
        <option value="> 60">over 60</option>
        {/* Add other age options as needed */}
      </select>
    </div>
  );
};

export default AgeFilter;
