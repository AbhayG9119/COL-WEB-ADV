import React, { useState } from 'react';
import { FaDotCircle, FaFolder } from 'react-icons/fa';
import Dashboard from '../components/Staff Pannel/Dashboard';
import Profile from '../components/Staff Pannel/Profile';
import UploadPhoto from '../components/Staff Pannel/UploadPhoto';
import CreateAssignment from '../components/Staff Pannel/CreateAssignment';
import ViewAssignments from '../components/Staff Pannel/ViewAssignments';
import Circulars from '../components/Staff Pannel/Circulars';
import MarkAttendance from '../components/Staff Pannel/MarkAttendance';
import AttendanceReport from '../components/Staff Pannel/AttendanceReport';
import Messaging from '../components/Staff Pannel/Messaging';
import EnquiryReport from '../components/Staff Pannel/EnquiryReport';
import '../styles/AdminPanel.css';

const StaffPanel = () => {
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [openMenu, setOpenMenu] = useState(null);

  const menus = [
    { name: 'Dashboard', sub: [] },
    { name: 'Profile', sub: [] },
    { name: 'Upload Photo', sub: [] },
    { name: 'Assignments', sub: ['Create Assignment', 'View Assignments'] },
    { name: 'Circulars', sub: [] },
    { name: 'Attendance', sub: ['Mark Attendance', 'Attendance Report'] },
    { name: 'Messaging', sub: [] },
    { name: 'Enquiry Report', sub: [] }
  ];

  const componentMap = {
    'Dashboard': Dashboard,
    'Profile': Profile,
    'Upload Photo': UploadPhoto,
    'Create Assignment': CreateAssignment,
    'View Assignments': ViewAssignments,
    'Circulars': Circulars,
    'Mark Attendance': MarkAttendance,
    'Attendance Report': AttendanceReport,
    'Messaging': Messaging,
    'Enquiry Report': EnquiryReport
  };

  const renderContent = () => {
    const Component = componentMap[activeMenu];
    return Component ? <Component /> : <Dashboard />;
  };

  const handleSubClick = (subName) => {
    setActiveMenu(subName);
  };

  const handleMainClick = (menu) => {
    if (menu.sub.length === 0) {
      setActiveMenu(menu.name);
      setOpenMenu(null);
    } else {
      setOpenMenu(prev => prev === menu.name ? null : menu.name);
    }
  };

  return (
    <div className="admin-panel">
      <nav className="side-nav">
        <h2>Staff Panel</h2>
        <ul className="nav-menu">
          {menus.map(menu => (
            <li key={menu.name} className={menu.sub.length > 0 && openMenu === menu.name ? 'open' : ''}>
              <button
                className={menu.sub.length === 0 && activeMenu === menu.name ? 'active' : ''}
                onClick={() => handleMainClick(menu)}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {menu.sub.length === 0 ? <FaDotCircle /> : <FaFolder />} {menu.name}
                </div>
                {menu.sub.length > 0 && (
                  <span className={`arrow ${openMenu === menu.name ? 'rotated' : ''}`}>▼</span>
                )}
              </button>
              {menu.sub.length > 0 && (
                <ul className={`sub-menu ${openMenu === menu.name ? 'open' : ''}`}>
                  {menu.sub.map(sub => (
                    <li key={sub}>
                      <button
                        className={activeMenu === sub ? 'active' : ''}
                        onClick={() => handleSubClick(sub)}
                      >
                        {sub}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <main className="content">
        {renderContent()}
      </main>
    </div>
  );
};

export default StaffPanel;
