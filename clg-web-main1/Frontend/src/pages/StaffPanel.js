import React, { useState } from 'react';
import { FaDotCircle, FaFolder } from 'react-icons/fa';
import StaffSidebar from '../components/Staff Pannel/StaffSidebar';
import Dashboard from '../components/Staff Pannel/Dashboard';
import Profile from '../components/Staff Pannel/Profile';
import UploadPhoto from '../components/Staff Pannel/UploadPhoto';
import CreateAssignment from '../components/Staff Pannel/CreateAssignment';
import ViewAssignments from '../components/Staff Pannel/ViewAssignments';
import Circulars from '../components/Staff Pannel/Circulars';
import MarkAttendance from '../components/Staff Pannel/MarkAttendance';
import AttendanceReport from '../components/Staff Pannel/AttendanceReport';
import Messaging from '../components/Staff Pannel/Messaging';
import ReportCard from '../components/Staff Pannel/ReportCard';
import Settings from '../components/Staff Pannel/Settings';
import LeaveManagement from '../components/Staff Pannel/LeaveManagement';
import Timetable from '../components/Staff Pannel/Timetable';
import Payroll from '../components/Staff Pannel/Payroll';
import AssignClass from '../components/Staff Pannel/AssignClass';
import '../styles/StaffPanel.css';

const StaffPanel = () => {
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [openMenu, setOpenMenu] = useState(null);

  const menus = [
    { name: 'Dashboard', sub: [] },
    { name: 'Profile Management', sub: ['Profile', 'Upload Photo', 'Contact Info'] },
    { name: 'Class Assignment Management', sub: ['Assign Class/Subject', 'View Assignments'] },
    { name: 'Attendance Management', sub: ['Attendance Entry', 'Attendance View', 'Daily/Monthly Reports'] },
    { name: 'Leave Management', sub: ['Apply for Leave', 'View Leave History'] },
    { name: 'Messaging', sub: ['Send/Receive Messages', 'Alerts'] },
    { name: 'Timetable', sub: [] },
    { name: 'Circular/Notices', sub: ['View Notices', 'Download'] },
    { name: 'Work Management', sub: ['Assignments', 'Reports'] },
    { name: 'Report Card', sub: [] },
    { name: 'Payroll', sub: ['View Salary', 'Payslip'] },
    { name: 'Settings', sub: ['Preferences', 'Logout'] }
  ];

  const componentMap = {
    'Dashboard': Dashboard,
    'Profile': Profile,
    'Upload Photo': UploadPhoto,
    'Assign Class/Subject': AssignClass,
    'View Assignments': ViewAssignments,
    'Attendance Entry': MarkAttendance,
    'Attendance View': AttendanceReport,
    'Daily/Monthly Reports': AttendanceReport,
    'Apply for Leave': LeaveManagement,
    'View Leave History': LeaveManagement,
    'Send/Receive Messages': Messaging,
    'Alerts': Messaging,
    'Timetable': Timetable,
    'View Notices': Circulars,
    'Download': Circulars,
    'Assignments': CreateAssignment,
    'Reports': ViewAssignments,
    'Report Card': ReportCard,
    'View Salary': Payroll,
    'Payslip': Payroll,
    'Preferences': Settings,
    'Logout': () => { localStorage.removeItem('token'); window.location.href = '/login'; }
  };

  const renderContent = () => {
    const Component = componentMap[activeMenu];
    if (typeof Component === 'function' && Component.name === 'Logout') {
      Component();
      return <div>Logging out...</div>;
    }
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
