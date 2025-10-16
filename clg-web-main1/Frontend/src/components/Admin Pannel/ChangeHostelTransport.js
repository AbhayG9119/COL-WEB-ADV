import React, { useState, useEffect } from 'react';
import FeeSummaryTable from './FeeSummaryTable';
import Alert from './Alert';

const ChangeHostelTransport = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [currentMapping, setCurrentMapping] = useState(null);
  const [updatedFees, setUpdatedFees] = useState([]);
  const [formData, setFormData] = useState({
    newHostel: '',
    newRoute: '',
    effectiveDate: ''
  });
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showUpdatedFees, setShowUpdatedFees] = useState(false);

  // Mock data - in real app, this would come from API
  const hostels = ['Hostel A', 'Hostel B', 'Hostel C', 'Hostel D'];
  const routes = ['Route 1', 'Route 2', 'Route 3', 'Route 4', 'Route 5'];



  useEffect(() => {
    // Set mock data for UI demonstration
    setSelectedStudent({
      id: 'STU001',
      name: 'John Doe',
      class: '10th Grade',
      session: '2023-2024'
    });
    setCurrentMapping({
      hostel: 'Hostel A',
      route: 'Route 1'
    });
    setUpdatedFees([
      { head: 'Tuition Fee', amount: 5000, paid: 3000, balance: 2000 },
      { head: 'Library Fee', amount: 500, paid: 500, balance: 0 },
      { head: 'Sports Fee', amount: 1000, paid: 500, balance: 500 },
      { head: 'Hostel Fee', amount: 3000, paid: 0, balance: 3000 }, // New hostel fee
      { head: 'Transport Fee', amount: 1500, paid: 0, balance: 1500 } // New transport fee
    ]);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePreviewUpdate = async () => {
    if (!formData.newHostel && !formData.newRoute) {
      setAlert({ message: 'Please select at least one change (hostel or transport)', type: 'error' });
      return;
    }

    setIsLoading(true);

    // Mock preview functionality
    setTimeout(() => {
      setIsLoading(false);
      setShowUpdatedFees(true);
      setAlert({ message: 'Fee calculation preview ready!', type: 'success' });
    }, 1000);
  };

  const handleConfirmUpdate = async () => {
    setIsLoading(true);

    // Mock confirmation functionality
    setTimeout(() => {
      setIsLoading(false);
      setAlert({ message: 'Hostel/Transport updated successfully!', type: 'success' });
      setShowUpdatedFees(false);
      setFormData({ newHostel: '', newRoute: '', effectiveDate: '' });
    }, 1000);
  };

  const userRole = localStorage.getItem('role');
  const canUpdate = ['admin', 'transport', 'hostel'].includes(userRole);

  return (
    <div className="menu-content">
      <h1>Change Hostel/Transport</h1>
      <p>Update hostel and transport assignments for students and recalculate fees.</p>

      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      {!canUpdate && (
        <div className="warning-message">
          <p>⚠️ You don't have permission to update hostel/transport assignments.</p>
        </div>
      )}

      {canUpdate && (
        <div className="change-mapping-container">
          {/* Search section commented out for UI demo */}
          {/* <div className="search-section">
            <StudentSearch
              onStudentSelect={setSelectedStudent}
              placeholder="Search student to update hostel/transport..."
            />
          </div> */}

          {selectedStudent && (
            <>
              <div className="student-info">
                <h3>Student: {selectedStudent.name} ({selectedStudent.id})</h3>
                <p>Class: {selectedStudent.class} | Session: {selectedStudent.session}</p>
              </div>

              {isLoading ? (
                <div className="loading">Loading current mapping...</div>
              ) : currentMapping && (
                <div className="current-mapping">
                  <h3>Current Mapping</h3>
                  <div className="mapping-info">
                    <p><strong>Hostel:</strong> {currentMapping.hostel}</p>
                    <p><strong>Transport Route:</strong> {currentMapping.route}</p>
                  </div>
                </div>
              )}

              <div className="update-form">
                <h3>Update Assignment</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>New Hostel:</label>
                    <select
                      name="newHostel"
                      value={formData.newHostel}
                      onChange={handleInputChange}
                    >
                      <option value="">Select hostel (leave unchanged)</option>
                      {hostels.map(hostel => (
                        <option key={hostel} value={hostel}>{hostel}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>New Transport Route:</label>
                    <select
                      name="newRoute"
                      value={formData.newRoute}
                      onChange={handleInputChange}
                    >
                      <option value="">Select route (leave unchanged)</option>
                      {routes.map(route => (
                        <option key={route} value={route}>{route}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Effective Date (Optional):</label>
                  <input
                    type="date"
                    name="effectiveDate"
                    value={formData.effectiveDate}
                    onChange={handleInputChange}
                  />
                  <small>If not specified, changes take effect immediately</small>
                </div>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handlePreviewUpdate}
                  disabled={isLoading || (!formData.newHostel && !formData.newRoute)}
                >
                  {isLoading ? 'Calculating...' : 'Preview Changes'}
                </button>
              </div>

              {showUpdatedFees && (
                <div className="updated-fees-preview">
                  <h3>Updated Fee Summary</h3>
                  <FeeSummaryTable fees={updatedFees} />

                  {(formData.newHostel !== currentMapping?.hostel || formData.newRoute !== currentMapping?.route) && (
                    <div className="proration-info">
                      <p><strong>Proration Applied:</strong> Fees have been recalculated based on the effective date.</p>
                      {formData.effectiveDate && (
                        <p>Changes effective from: {new Date(formData.effectiveDate).toLocaleDateString()}</p>
                      )}
                    </div>
                  )}

                  <div className="action-buttons">
                    <button
                      className="btn btn-primary"
                      onClick={handleConfirmUpdate}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Updating...' : 'Confirm Update'}
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowUpdatedFees(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChangeHostelTransport;
