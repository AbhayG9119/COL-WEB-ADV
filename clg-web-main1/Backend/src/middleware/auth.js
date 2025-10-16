import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Faculty from '../models/Faculty.js';
import StudentBAS from '../models/StudentBAS.js';
import StudentBSc from '../models/StudentBSc.js';
import StudentBEd from '../models/StudentBEd.js';

export const protect = async (req, res, next) => {
  let token;

  console.log('Protect middleware called for path:', req.path); // Add logging
  console.log('Authorization header:', req.headers.authorization); // Add logging

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1].trim();
      console.log('Token extracted:', token ? 'present' : 'missing'); // Add logging

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded); // Add logging

      // Get user from token
      let user;
      if (decoded.role === 'admin') {
        user = await Admin.findById(decoded.id).select('-password');
        console.log('Admin user found:', user ? user.email : 'not found'); // Add logging
      } else if (decoded.role === 'faculty') {
        user = await Faculty.findById(decoded.id).select('-password');
        console.log('Faculty user found:', user ? user.name : 'not found'); // Add logging
      } else if (decoded.role === 'student') {
        user = await StudentBAS.findById(decoded.id).select('-password') ||
               await StudentBSc.findById(decoded.id).select('-password') ||
               await StudentBEd.findById(decoded.id).select('-password');
        console.log('Student user found:', user ? user.firstName + ' ' + user.lastName : 'not found'); // Add logging
      }

      if (!user) {
        console.log('User not found for decoded:', decoded); // Add logging
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      req.user = user;
      req.user.role = decoded.role;
      console.log('User authenticated:', req.user.email || req.user.name || req.user.username, 'Role:', req.user.role); // Add logging
      next();
    } catch (error) {
      console.error('Token verification error:', error.message); // Enhanced logging
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.log('No authorization header or not starting with Bearer'); // Add logging
  }

  if (!token) {
    console.log('No token provided'); // Add logging
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
