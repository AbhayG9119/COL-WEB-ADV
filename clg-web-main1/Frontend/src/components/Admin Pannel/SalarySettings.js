import React, { useState, useEffect } from 'react';

const SalarySettings = () => {
  const [templates, setTemplates] = useState([]);
  const [currentTemplate, setCurrentTemplate] = useState({
    name: '',
    basePay: '',
    allowances: [{ name: '', amount: '' }],
    deductions: [{ name: '', amount: '' }],
    effectiveDate: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');

  // Mock data for existing templates
  useEffect(() => {
    const mockTemplates = [
      {
        id: 1,
        name: 'Teacher Template',
        basePay: 30000,
        allowances: [{ name: 'HRA', amount: 5000 }, { name: 'Conveyance', amount: 2000 }],
        deductions: [{ name: 'PF', amount: 1800 }, { name: 'Tax', amount: 1500 }],
        effectiveDate: '2024-01-01'
      },
      {
        id: 2,
        name: 'Clerk Template',
        basePay: 25000,
        allowances: [{ name: 'HRA', amount: 4000 }],
        deductions: [{ name: 'PF', amount: 1500 }],
        effectiveDate: '2024-01-01'
      }
    ];
    setTemplates(mockTemplates);
  }, []);

  const handleInputChange = (field, value) => {
    setCurrentTemplate(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAllowanceChange = (index, field, value) => {
    const newAllowances = [...currentTemplate.allowances];
    newAllowances[index][field] = value;
    setCurrentTemplate(prev => ({
      ...prev,
      allowances: newAllowances
    }));
  };

  const handleDeductionChange = (index, field, value) => {
    const newDeductions = [...currentTemplate.deductions];
    newDeductions[index][field] = value;
    setCurrentTemplate(prev => ({
      ...prev,
      deductions: newDeductions
    }));
  };

  const addAllowance = () => {
    setCurrentTemplate(prev => ({
      ...prev,
      allowances: [...prev.allowances, { name: '', amount: '' }]
    }));
  };

  const removeAllowance = (index) => {
    setCurrentTemplate(prev => ({
      ...prev,
      allowances: prev.allowances.filter((_, i) => i !== index)
    }));
  };

  const addDeduction = () => {
    setCurrentTemplate(prev => ({
      ...prev,
      deductions: [...prev.deductions, { name: '', amount: '' }]
    }));
  };

  const removeDeduction = (index) => {
    setCurrentTemplate(prev => ({
      ...prev,
      deductions: prev.deductions.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    if (!currentTemplate.name.trim()) {
      setMessage('Template name is required');
      return false;
    }
    if (!currentTemplate.basePay || currentTemplate.basePay <= 0) {
      setMessage('Base pay must be greater than 0');
      return false;
    }
    const totalDeductions = currentTemplate.deductions.reduce((sum, ded) => sum + (parseFloat(ded.amount) || 0), 0);
    if (totalDeductions > currentTemplate.basePay) {
      setMessage('Total deductions cannot exceed base pay');
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const newTemplate = {
      id: Date.now(),
      ...currentTemplate,
      basePay: parseFloat(currentTemplate.basePay),
      allowances: currentTemplate.allowances.map(a => ({ ...a, amount: parseFloat(a.amount) || 0 })),
      deductions: currentTemplate.deductions.map(d => ({ ...d, amount: parseFloat(d.amount) || 0 }))
    };

    setTemplates(prev => [...prev, newTemplate]);
    setMessage('Template saved successfully');
    setTimeout(() => setMessage(''), 3000);
    handleReset();
  };

  const handleReset = () => {
    setCurrentTemplate({
      name: '',
      basePay: '',
      allowances: [{ name: '', amount: '' }],
      deductions: [{ name: '', amount: '' }],
      effectiveDate: ''
    });
  };

  const handleExport = (format) => {
    // Mock export functionality
    alert(`Exporting template as ${format.toUpperCase()}`);
  };

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="menu-content">
      <h1>Salary Settings</h1>
      <p>Define reusable salary templates with base pay, allowances, and deductions.</p>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px', width: '200px', marginRight: '10px' }}
        />
        <button onClick={() => setSearchTerm('')} style={{ padding: '8px 16px' }}>Clear</button>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <h2>Create/Edit Template</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div style={{ marginBottom: '10px' }}>
              <label title="Unique identifier for salary structure">Template Name:</label>
              <input
                type="text"
                value={currentTemplate.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label title="Required, must be > 0">Base Pay:</label>
              <input
                type="number"
                value={currentTemplate.basePay}
                onChange={(e) => handleInputChange('basePay', e.target.value)}
                min="0"
                step="0.01"
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label>Allowances:</label>
              {currentTemplate.allowances.map((allowance, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                  <input
                    type="text"
                    placeholder="Allowance name"
                    value={allowance.name}
                    onChange={(e) => handleAllowanceChange(index, 'name', e.target.value)}
                    style={{ flex: 1, padding: '8px', marginRight: '5px' }}
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={allowance.amount}
                    onChange={(e) => handleAllowanceChange(index, 'amount', e.target.value)}
                    min="0"
                    step="0.01"
                    style={{ width: '100px', padding: '8px', marginRight: '5px' }}
                  />
                  <button type="button" onClick={() => removeAllowance(index)} style={{ padding: '8px' }}>Remove</button>
                </div>
              ))}
              <button type="button" onClick={addAllowance} style={{ padding: '8px', marginTop: '5px' }}>Add Allowance</button>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label>Deductions:</label>
              {currentTemplate.deductions.map((deduction, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                  <input
                    type="text"
                    placeholder="Deduction name"
                    value={deduction.name}
                    onChange={(e) => handleDeductionChange(index, 'name', e.target.value)}
                    style={{ flex: 1, padding: '8px', marginRight: '5px' }}
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={deduction.amount}
                    onChange={(e) => handleDeductionChange(index, 'amount', e.target.value)}
                    min="0"
                    step="0.01"
                    style={{ width: '100px', padding: '8px', marginRight: '5px' }}
                  />
                  <button type="button" onClick={() => removeDeduction(index)} style={{ padding: '8px' }}>Remove</button>
                </div>
              ))}
              <button type="button" onClick={addDeduction} style={{ padding: '8px', marginTop: '5px' }}>Add Deduction</button>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label title="Optional, for future activation">Effective Date:</label>
              <input
                type="date"
                value={currentTemplate.effectiveDate}
                onChange={(e) => handleInputChange('effectiveDate', e.target.value)}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>

            <div style={{ marginTop: '20px' }}>
              <button type="submit" style={{ padding: '10px 20px', marginRight: '10px' }}>Save Template</button>
              <button type="button" onClick={handleReset} style={{ padding: '10px 20px', marginRight: '10px' }}>Reset</button>
              <button type="button" onClick={() => handleExport('excel')} style={{ padding: '10px 20px', marginRight: '10px' }}>Export as Excel</button>
              <button type="button" onClick={() => handleExport('pdf')} style={{ padding: '10px 20px' }}>Export as PDF</button>
            </div>
          </form>
          {message && <div style={{ marginTop: '10px', color: message.includes('success') ? 'green' : 'red' }}>{message}</div>}
        </div>

        <div style={{ flex: 1 }}>
          <h2>Existing Templates</h2>
          {filteredTemplates.length === 0 ? (
            <p>No templates found.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {filteredTemplates.map(template => (
                <li key={template.id} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
                  <h3>{template.name}</h3>
                  <p><strong>Base Pay:</strong> ₹{template.basePay}</p>
                  <p><strong>Allowances:</strong> {template.allowances.map(a => `${a.name}: ₹${a.amount}`).join(', ')}</p>
                  <p><strong>Deductions:</strong> {template.deductions.map(d => `${d.name}: ₹${d.amount}`).join(', ')}</p>
                  <p><strong>Effective Date:</strong> {template.effectiveDate || 'N/A'}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalarySettings;
