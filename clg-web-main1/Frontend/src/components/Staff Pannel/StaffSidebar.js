import React from 'react';
import { Link } from 'react-router-dom';
import './StaffSidebar.css'; // Assume CSS file will be created later

const StaffSidebar = () => {
  const menuItems = [
    {
      name: 'Dashboard',
      path: '/staff/dashboard',
      subMenu: null
    },
    {
      name: 'Profile Management',
      path: null,
      subMenu: [
        { name: 'Profile', path: '/staff/profile' },
        { name: 'Photo', path: '/staff/upload-photo' },
        { name: 'Contact Info', path: '/staff/contact-info' }
      ]
    },
    {
      name: 'Class Assignment Management',
      path: '/staff/assign-class',
      subMenu: [
        { name: 'Assign Class/Subject', path: '/staff/assign-class' },
        { name: 'View Assignments', path: '/staff/view-assignments' }
      ]
    },
    {
      name: 'Attendance Management',
      path: null,
      subMenu: [
        { name: 'Mark Attendance', path: '/staff/mark-attendance' },
        { name: 'Attendance Report', path: '/staff/attendance-report' }
      ]
    },
    {
      name: 'Leave Management',
      path: '/staff/leave-management',
      subMenu: [
        { name: 'Apply for Leave', path: '/staff/apply-leave' },
        { name: 'View Leave History', path: '/staff/view-leaves' }
      ]
    },
    {
      name: 'Messaging',
      path: '/staff/messaging',
      subMenu: [
        { name: 'Send/Receive Messages', path: '/staff/messaging' },
      ]
    },
    {
      name: 'Timetable',
      path: '/staff/timetable',
      subMenu: null
    },
    {
      name: 'Circular/Notices',
      path: '/staff/circulars',
      subMenu: [
        { name: 'View Notices', path: '/staff/circulars' },
        { name: 'Download', path: '/staff/download-notices' }
      ]
    },
    {
      name: 'Assignment Management',
      path: null,
      subMenu: [
        { name: 'Create Assignment', path: '/staff/create-assignment' },
        { name: 'View Submissions', path: '/staff/view-submissions' },
        { name: 'Grade Assignments', path: '/staff/grade-assignments' }
      ]
    },
    {
      name: 'Work Management',
      path: null,
      subMenu: [
        { name: 'Reports', path: '/staff/work-reports' }
      ]
    },
    {
      name: 'Report Card',
      path: '/staff/report-card',
      subMenu: null
    },
    {
      name: 'Payroll',
      path: '/staff/payroll',
      subMenu: [
        { name: 'View Salary', path: '/staff/view-salary' },
        { name: 'Payslip', path: '/staff/payslip' }
      ]
    },
    {
      name: 'Settings',
      path: '/staff/settings',
      subMenu: [
        { name: 'Preferences', path: '/staff/preferences' },
        { name: 'Logout', path: '/logout' }
      ]
    }
  ];

  const renderMenuItem = (item) => {
    if (item.subMenu) {
      return (
        <li key={item.name} className="sidebar-item has-submenu">
          <span className="submenu-toggle">{item.name}</span>
          <ul className="submenu">
            {item.subMenu.map(sub => (
              <li key={sub.name}>
                <Link to={sub.path}>{sub.name}</Link>
              </li>
            ))}
          </ul>
        </li>
      );
    }
    return (
      <li key={item.name} className="sidebar-item">
        <Link to={item.path}>{item.name}</Link>
      </li>
    );
  };

  return (
    <div className="staff-sidebar">
      <ul className="sidebar-menu">
        {menuItems.map(renderMenuItem)}
      </ul>
    </div>
  );
};

export default StaffSidebar;
