import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Faculty from '../models/Faculty.js';
import Student from '../models/studentModel.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      let user;
      if (decoded.role === 'admin') {
        user = await Admin.findById(decoded.id).select('-password');
      } else if (decoded.role === 'faculty') {
        user = await Faculty.findById(decoded.id).select('-password');
      } else if (decoded.role === 'student') {
        user = await Student.findById(decoded.id).select('-password');
      }

      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      req.user = user;
      req.user.role = decoded.role;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
