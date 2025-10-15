import React from 'react';

const TransportRoutesFare = () => {
  return (
    <div className="menu-content">
      <h1>Transport Routes & Fare</h1>
      <p>Set bus routes and charges.</p>
      {/* Placeholder for form */}
      <form>
        <label>Route:</label>
        <input type="text" placeholder="e.g., Route A" />
        <label>Fare:</label>
        <input type="number" />
        <button type="submit">Add Route</button>
      </form>
    </div>
  );
};

export default TransportRoutesFare;
