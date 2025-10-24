import React, { useState, useEffect, useMemo } from 'react';
import './Permissions.css';

const Permissions = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [modules, setModules] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [alert, setAlert] = useState(null);

  const roles = ['Admin', 'Staff', 'Student'];

  const allModules = useMemo(() => ({
    Dashboard: { category: 'Communication', tooltip: 'Main dashboard for overview' },
    Fees: { category: 'Administrative', tooltip: 'Manage fee collection and receipts' },
    Staff: { category: 'Administrative', tooltip: 'Staff registration and management' },
    Certificates: { category: 'Academic', tooltip: 'Issue TC/CC to students' },
    Circulars: { category: 'Communication', tooltip: 'Create and manage notices' },
    'Work Management': { category: 'Administrative', tooltip: 'Assign and track tasks' },
    Expenses: { category: 'Administrative', tooltip: 'Track and approve expenses' },
    Enquiries: { category: 'Academic', tooltip: 'Handle student enquiries' },
    Reports: { category: 'System', tooltip: 'Generate various reports' },
    Permissions: { category: 'System', tooltip: 'Manage role permissions' }
  }), []);

  const roleModules = useMemo(() => ({
    Admin: Object.keys(allModules),
    Staff: ['Dashboard', 'Certificates', 'Circulars', 'Work Management', 'Enquiries', 'Reports'],
    Student: ['Dashboard', 'Fees', 'Certificates', 'Circulars', 'Enquiries']
  }), [allModules]);

  const roleDescriptions = {
    Admin: 'Full access to all modules',
    Staff: 'Operational role with access to certificates and circulars',
    Student: 'Limited access for viewing and submitting enquiries'
  };

  useEffect(() => {
    if (selectedRole) {
      const initialModules = {};
      roleModules[selectedRole].forEach(module => {
        initialModules[module] = selectedRole !== 'Student'; // Enabled for Admin/Staff, disabled for Student
      });
      setModules(initialModules);
    }
  }, [selectedRole, roleModules]);

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
    setSearchTerm('');
  };

  const handleModuleChange = (module) => {
    if (selectedRole === 'Student') return; // Students have view-only
    setModules(prev => ({
      ...prev,
      [module]: !prev[module]
    }));
  };

  const handleSave = () => {
    // Mock save functionality
    setAlert({ message: 'Permissions saved successfully!', type: 'success' });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleExport = (format) => {
    alert(`Exporting to ${format}...`);
  };

  const filteredModules = Object.keys(modules).filter(module =>
    module.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedModules = filteredModules.reduce((acc, module) => {
    const category = allModules[module].category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(module);
    return acc;
  }, {});

  const currentAccessSummary = selectedRole ? `${Object.keys(modules).filter(m => modules[m]).length} modules assigned` : '';

  return (
    <div className="menu-content">
      <h1>Assign Permissions</h1>

      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.message}
        </div>
      )}

      {/* Section 1: Select Role */}
      <div className="section">
        <label>Select Role</label>
        <select value={selectedRole} onChange={handleRoleChange}>
          <option value="">Select Role</option>
          {roles.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
        {selectedRole && (
          <div className="role-description">
            <p><strong>Description:</strong> {roleDescriptions[selectedRole]}</p>
            <p><strong>Current Access Summary:</strong> {currentAccessSummary}</p>
          </div>
        )}
      </div>

      {/* Section 2: Display Role-Specific Modules */}
      {selectedRole && (
        <div className="section">
          <h3>Assign Modules</h3>
          {Object.keys(groupedModules).map(category => (
            <div key={category} className="module-group">
              <h4>{category}</h4>
              <div className="module-list">
                {groupedModules[category].map(module => (
                  <div key={module} className="module-item">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={modules[module] || false}
                        onChange={() => handleModuleChange(module)}
                        disabled={selectedRole === 'Student'}
                      />
                      {module}
                    </label>
                    <span className="tooltip" title={allModules[module].tooltip}>?</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {selectedRole === 'Student' && (
            <p className="note">Enquiries module is marked as "Submit-only" for students.</p>
          )}
        </div>
      )}

      {/* Section 3: Search & Filter */}
      {selectedRole && (
        <div className="section">
          <label>Search Modules</label>
          <input
            type="text"
            placeholder="Search modules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {/* Section 4: Save Permissions */}
      {selectedRole && (
        <div className="section">
          <button className="btn btn-primary" onClick={handleSave}>
            Save Permissions
          </button>
        </div>
      )}

      {/* Section 5: Export & Audit */}
      {selectedRole && (
        <div className="section">
          <h3>Export & Audit</h3>
          <div className="export-controls">
            <button className="btn" onClick={() => handleExport('Excel')}>Export to Excel</button>
            <button className="btn" onClick={() => handleExport('PDF')}>Export to PDF</button>
          </div>
          <div className="effective-date">
            <label>Effective Date</label>
            <input
              type="date"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
            />
          </div>
          <div className="audit-log">
            <h4>Audit Log</h4>
            <ul>
              <li>Last updated by admin_01 on 2025-10-22</li>
              {/* Mock audit entries */}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Permissions;
