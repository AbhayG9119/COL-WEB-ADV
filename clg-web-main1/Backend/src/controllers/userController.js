import Admin from '../models/Admin.js';
import Faculty from '../models/Faculty.js';
import StudentBAS from '../models/StudentBAS.js';
import StudentBSc from '../models/StudentBSc.js';
import StudentBEd from '../models/StudentBEd.js';
import bcrypt from 'bcrypt';

// Get all users
export const getUsers = async (req, res) => {
  try {
    console.log('Fetching users...'); // Add logging
    const admins = await Admin.find().select('-password');
    console.log('Admins fetched:', admins.length); // Add logging
    const faculty = await Faculty.find().select('-password');
    console.log('Faculty fetched:', faculty.length); // Add logging
    const studentsBAS = await StudentBAS.find().select('-password');
    console.log('StudentBAS fetched:', studentsBAS.length); // Add logging
    const studentsBSc = await StudentBSc.find().select('-password');
    console.log('StudentBSc fetched:', studentsBSc.length); // Add logging
    const studentsBEd = await StudentBEd.find().select('-password');
    console.log('StudentBEd fetched:', studentsBEd.length); // Add logging

    const users = [
      ...admins.map(user => ({ ...user.toObject(), role: 'admin', name: user.email })),
      ...faculty.map(user => ({ ...user.toObject(), role: 'faculty', name: user.name || user.username })),
      ...studentsBAS.map(user => ({ ...user.toObject(), role: 'student', department: 'B.A', name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || user.email })),
      ...studentsBSc.map(user => ({ ...user.toObject(), role: 'student', department: 'B.Sc', name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || user.email })),
      ...studentsBEd.map(user => ({ ...user.toObject(), role: 'student', department: 'B.Ed', name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || user.email }))
    ];

    console.log('Total users:', users.length); // Add logging
    res.json(users);
  } catch (error) {
    console.error('Error in getUsers:', error);
    console.error('Error details:', error.message); // Add more logging
    console.error('Error stack:', error.stack); // Add stack trace
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add new user
export const addUser = async (req, res) => {
  const { name, email, password, role, department, year, semester, mobileNumber, designation, subject, subjectsTaught, qualifications, joiningDate, phone, address } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Email, password, and role are required' });
  }

  try {
    let user;

    if (role === 'admin') {
      user = new Admin({ email, password });
    } else if (role === 'faculty') {
      if (!name || !designation || !department || !subject || !req.body.staffId) {
        return res.status(400).json({ message: 'Name, designation, department, subject, and staffId are required for faculty' });
      }
      user = new Faculty({
        username: email, // Use email as username
        email,
        password,
        name,
        designation,
        department,
        subject,
        subjectsTaught: subjectsTaught || [],
        qualifications,
        joiningDate: joiningDate ? new Date(joiningDate) : new Date(),
        phone,
        address,
        staffId: req.body.staffId // Add staffId from request body
      });
    } else if (role === 'student') {
      if (!name || !department || !year || !semester || !mobileNumber) {
        return res.status(400).json({ message: 'Name, department, year, semester, and mobile number are required for students' });
      }

      // Split name into first and last name
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Generate roll number
      const rollNo = `${department.replace('.', '')}${year}${semester}${Date.now().toString().slice(-4)}`;

      // Default values for required fields
      const defaultAddress = {
        street: 'Not Provided',
        city: 'Not Provided',
        state: 'Not Provided',
        pincode: '000000'
      };

      const studentData = {
        firstName,
        lastName,
        username: email, // Use email as username
        email,
        password,
        mobileNumber,
        rollNo,
        department,
        year: parseInt(year),
        semester: parseInt(semester),
        dateOfBirth: new Date('2000-01-01'), // Default DOB
        gender: 'Male', // Default gender
        bloodGroup: 'O+', // Default blood group
        address: defaultAddress,
        guardianName: 'Not Provided',
        guardianContact: 'Not Provided',
        securityQuestion: 'What is your favorite color?',
        securityAnswer: 'Not Provided'
      };

      if (department === 'B.A') {
        user = new StudentBAS(studentData);
      } else if (department === 'B.Sc') {
        user = new StudentBSc(studentData);
      } else if (department === 'B.Ed') {
        user = new StudentBEd(studentData);
      } else {
        return res.status(400).json({ message: 'Invalid department for student' });
      }
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    await user.save();
    res.status(201).json({ message: 'User added successfully', user: { ...user.toObject(), role } });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'User with this email already exists' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

// Edit user
export const editUser = async (req, res) => {
  const { id, role } = req.params;
  const updates = req.body;

  // Remove password from updates if empty
  if (!updates.password) {
    delete updates.password;
  }

  try {
    let user;
    let Model;

    if (role === 'admin') {
      Model = Admin;
    } else if (role === 'faculty') {
      Model = Faculty;
    } else if (role === 'student') {
      // Determine model based on department
      const existingUser = await StudentBAS.findById(id) || await StudentBSc.findById(id) || await StudentBEd.findById(id);
      if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (existingUser.department === 'B.A') {
        Model = StudentBAS;
      } else if (existingUser.department === 'B.Sc') {
        Model = StudentBSc;
      } else if (existingUser.department === 'B.Ed') {
        Model = StudentBEd;
      }

      // For students, parse the 'name' field into firstName, middleName, lastName
      if (updates.name !== undefined) {
        const nameParts = updates.name.trim().split(/\s+/);
        if (nameParts.length === 1) {
          updates.firstName = nameParts[0];
          updates.lastName = '';
          updates.middleName = '';
        } else if (nameParts.length === 2) {
          updates.firstName = nameParts[0];
          updates.lastName = nameParts[1];
          updates.middleName = '';
        } else {
          updates.firstName = nameParts[0];
          updates.lastName = nameParts[nameParts.length - 1];
          updates.middleName = nameParts.slice(1, -1).join(' ');
        }
        delete updates.name; // Remove the original name field
      }
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    user = await Model.findByIdAndUpdate(id, updates, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user: { ...user.toObject(), role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  const { id, role } = req.params;

  try {
    let Model;
    let user;

    if (role === 'admin') {
      Model = Admin;
    } else if (role === 'faculty') {
      Model = Faculty;
    } else if (role === 'student') {
      user = await StudentBAS.findById(id) || await StudentBSc.findById(id) || await StudentBEd.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (user.department === 'B.A') {
        Model = StudentBAS;
      } else if (user.department === 'B.Sc') {
        Model = StudentBSc;
      } else if (user.department === 'B.Ed') {
        Model = StudentBEd;
      }
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    user = await Model.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  const { id, role } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ message: 'New password is required' });
  }

  try {
    let Model;
    let user;

    if (role === 'admin') {
      Model = Admin;
    } else if (role === 'faculty') {
      Model = Faculty;
    } else if (role === 'student') {
      user = await StudentBAS.findById(id) || await StudentBSc.findById(id) || await StudentBEd.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (user.department === 'B.A') {
        Model = StudentBAS;
      } else if (user.department === 'B.Sc') {
        Model = StudentBSc;
      } else if (user.department === 'B.Ed') {
        Model = StudentBEd;
      }
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user = await Model.findByIdAndUpdate(id, { password: hashedPassword }, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
