import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';
import Admin from '../models/Admin.js';

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing or invalid' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    let user = await Student.findById(decoded.id);
    if (!user) {
      user = await Faculty.findById(decoded.id);
      if (!user) {
        user = await Admin.findById(decoded.id);
        if (!user) {
          return res.status(401).json({ message: 'User not found' });
        }
      }
    }
    req.user = user;
    console.log('req.user set:', req.user._id, 'role:', req.user.role);
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    return res.status(401).json({ message: 'Token verification failed' });
  }
};

export default authMiddleware;
