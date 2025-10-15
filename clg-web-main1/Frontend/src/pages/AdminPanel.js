import React, { useState } from 'react';
import { FaDotCircle, FaFolder } from 'react-icons/fa';
import Dashboard from '../components/Admin Pannel/Dashboard';
import UserManagement from '../components/Admin Pannel/UserManagement';
import AcademicManagement from '../components/Admin Pannel/AcademicManagement';
import Admission from '../components/Admin Pannel/Admission';
import FeesManagement from '../components/Admin Pannel/FeesManagement';
import Circulars from '../components/Admin Pannel/Circulars';
import StaffManagement from '../components/Admin Pannel/StaffManagement';
import WorkManagement from '../components/Admin Pannel/WorkManagement';
import ExpenseManagement from '../components/Admin Pannel/ExpenseManagement';
import EnquiryManagement from '../components/Admin Pannel/EnquiryManagement';
import Certificates from '../components/Admin Pannel/Certificates';
import Reports from '../components/Admin Pannel/Reports';
import Permissions from '../components/Admin Pannel/Permissions';
import Payroll from '../components/Admin Pannel/Payroll';
import Cards from '../components/Admin Pannel/Cards';
import AddUser from '../components/Admin Pannel/AddUser';
import ManageUsers from '../components/Admin Pannel/ManageUsers';
import SessionManagement from '../components/Admin Pannel/SessionManagement';
import SetFeeStructure from '../components/Admin Pannel/SetFeeStructure';
import TransportRoutesFare from '../components/Admin Pannel/TransportRoutesFare';
import HostelFees from '../components/Admin Pannel/HostelFees';
import GenerateDiscount from '../components/Admin Pannel/GenerateDiscount';
import AddSubject from '../components/Admin Pannel/AddSubject';
import Registration from '../components/Admin Pannel/Registration';
import NewAdmission from '../components/Admin Pannel/NewAdmission';
import CollectFees from '../components/Admin Pannel/CollectFees';
import DuplicateReceipt from '../components/Admin Pannel/DuplicateReceipt';
import CancelReceipt from '../components/Admin Pannel/CancelReceipt';
import ChangeHostelTransport from '../components/Admin Pannel/ChangeHostelTransport';
import AddDesignation from '../components/Admin Pannel/AddDesignation';
import RegisterStaff from '../components/Admin Pannel/RegisterStaff';
import StaffAttendance from '../components/Admin Pannel/StaffAttendance';
import AssignClass from '../components/Admin Pannel/AssignClass';
import LeaveDays from '../components/Admin Pannel/LeaveDays';
import AddWork from '../components/Admin Pannel/AddWork';
import AddWorkReport from '../components/Admin Pannel/AddWorkReport';
import AssignWork from '../components/Admin Pannel/AssignWork';
import StaffWorkDetails from '../components/Admin Pannel/StaffWorkDetails';
import StaffWorkUpdates from '../components/Admin Pannel/StaffWorkUpdates';
import ExpenseEntry from '../components/Admin Pannel/ExpenseEntry';
import ExpenseReports from '../components/Admin Pannel/ExpenseReports';
import AddEnquiry from '../components/Admin Pannel/AddEnquiry';
import EnquiryDetail from '../components/Admin Pannel/EnquiryDetail';
import EnquiryFollowUp from '../components/Admin Pannel/EnquiryFollowUp';
import AddVisitor from '../components/Admin Pannel/AddVisitor';
import VisitedList from '../components/Admin Pannel/VisitedList';
import TransferCertificate from '../components/Admin Pannel/TransferCertificate';
import CharacterCertificate from '../components/Admin Pannel/CharacterCertificate';
import SalarySettings from '../components/Admin Pannel/SalarySettings';
import GenerateSalary from '../components/Admin Pannel/GenerateSalary';
import GeneratePayslip from '../components/Admin Pannel/GeneratePayslip';
import PrintIDCard from '../components/Admin Pannel/PrintIDCard';
import GenerateAdmitCard from '../components/Admin Pannel/GenerateAdmitCard';
import PrintAdmitCard from '../components/Admin Pannel/PrintAdmitCard';
import ExaminationCenter from '../components/Admin Pannel/ExaminationCenter';
import AdmissionQuery from '../components/Admin Pannel/AdmissionQuery';
import ContactUs from '../components/Admin Pannel/ContactUs';
import NCCQuery from '../components/Admin Pannel/NCCQuery';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [openMenu, setOpenMenu] = useState(null);

  const menus = [
    { name: 'Dashboard', sub: [] },
    { name: 'User Management', sub: ['Add User', 'Manage Users'] },
    { name: 'Academic Management', sub: ['Session Management', 'Set Fee Structure', 'Transport Routes & Fare', 'Hostel Fees', 'Generate Discount', 'Add Subject'] },
    { name: 'Registration & Admission', sub: ['Registration', 'New Admission'] },
    { name: 'Fees & Receipts', sub: ['Collect Fees', 'Duplicate Receipt', 'Cancel Receipt', 'Change Hostel/Transport'] },
    { name: 'Circulars / Notice', sub: [] },
    { name: 'Staff Management', sub: ['Add Designation', 'Register Staff', 'Staff Attendance', 'Assign Class', 'Leave Days'] },
    { name: 'Work Management', sub: ['Add Work', 'Add Work Report', 'Assign Work', 'Staff Work Details', 'Staff Work Updates'] },
    { name: 'Expense Management', sub: ['Expense Entry', 'Expense Reports'] },
    { name: 'Enquiry Management', sub: ['Add Enquiry', 'Enquiry Detail', 'Enquiry Follow-up', 'Add Visitor', 'Visited List'] },
    { name: 'Certificates', sub: ['Transfer Certificate', 'Character Certificate'] },
    { name: 'Forms', sub: ['Admission Query', 'Contact Us', 'NCC Query'] },
    { name: 'Reports', sub: [] },
    { name: 'Permissions', sub: [] },
    { name: 'Payroll', sub: ['Salary Settings', 'Generate Salary', 'Generate Payslip'] },
    { name: 'ID & Admit Cards', sub: ['Print ID Card', 'Generate Admit Card', 'Print Admit Card', 'Examination Center'] }
  ];

  const componentMap = {
    'Dashboard': Dashboard,
    'Add User': AddUser,
    'Manage Users': ManageUsers,
    'Session Management': SessionManagement,
    'Set Fee Structure': SetFeeStructure,
    'Transport Routes & Fare': TransportRoutesFare,
    'Hostel Fees': HostelFees,
    'Generate Discount': GenerateDiscount,
    'Add Subject': AddSubject,
    'Registration': Registration,
    'New Admission': NewAdmission,
    'Collect Fees': CollectFees,
    'Duplicate Receipt': DuplicateReceipt,
    'Cancel Receipt': CancelReceipt,
    'Change Hostel/Transport': ChangeHostelTransport,
    'Circulars / Notice': Circulars,
    'Add Designation': AddDesignation,
    'Register Staff': RegisterStaff,
    'Staff Attendance': StaffAttendance,
    'Assign Class': AssignClass,
    'Leave Days': LeaveDays,
    'Add Work': AddWork,
    'Add Work Report': AddWorkReport,
    'Assign Work': AssignWork,
    'Staff Work Details': StaffWorkDetails,
    'Staff Work Updates': StaffWorkUpdates,
    'Expense Entry': ExpenseEntry,
    'Expense Reports': ExpenseReports,
    'Add Enquiry': AddEnquiry,
    'Enquiry Detail': EnquiryDetail,
    'Enquiry Follow-up': EnquiryFollowUp,
    'Add Visitor': AddVisitor,
    'Visited List': VisitedList,
    'Transfer Certificate': TransferCertificate,
    'Character Certificate': CharacterCertificate,
    'Admission Query': AdmissionQuery,
    'Contact Us': ContactUs,
    'NCC Query': NCCQuery,
    'Reports': Reports,
    'Permissions': Permissions,
    'Salary Settings': SalarySettings,
    'Generate Salary': GenerateSalary,
    'Generate Payslip': GeneratePayslip,
    'Print ID Card': PrintIDCard,
    'Generate Admit Card': GenerateAdmitCard,
    'Print Admit Card': PrintAdmitCard,
    'Examination Center': ExaminationCenter
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
        <h2>Admin Panel</h2>
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

export default AdminPanel;
