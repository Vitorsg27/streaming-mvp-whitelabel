import { verifyToken } from '../utils/auth.js';

export async function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.user = decoded;
  console.log('User decoded from token:', req.user); // Debug log
  next();
}

export function optionalAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      req.user = decoded;
      console.log('User decoded from token:', req.user);
    }
  }

  next();
}

export function adminOnly(req, res, next) {
  console.log('Checking admin access. User role:', req.user?.role); // Debug log
  if (!req.user || req.user.role !== 'admin') {
    console.log('Access denied. User is not admin:', req.user); // Debug log
    return res.status(403).json({ error: 'Access denied. Admin only.' });
  }
  next();
}
