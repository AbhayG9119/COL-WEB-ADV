import jwt from 'jsonwebtoken';
import AdminUser from '../models/AdminUser.js';
import Hod from '../models/Hod.js';
import Student from '../models/Student.js';

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user;

    // Find user based on role
    switch (decoded.role) {
      case 'admin':
        user = await AdminUser.findById(decoded.id);
        break;
      case 'hod':
        user = await Hod.findById(decoded.id);
        break;
      case 'student':
        user = await Student.findById(decoded.id);
        break;
      default:
        return res.status(401).json({ message: 'Invalid role' });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

export default auth;
