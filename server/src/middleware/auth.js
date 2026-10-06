// DisasterOS Authentication & Role-Based Access Control (RBAC)
import jwt from 'jsonwebtoken';
import { store } from '../database/store.js';

const JWT_SECRET = process.env.JWT_SECRET || 'disasteros_secret_development_key_2026';

export function authenticate(req, res, next) {
  // Check Authorization header or Demo Role Switcher header
  const authHeader = req.headers['authorization'];
  const demoRole = req.headers['x-demo-role'];
  const demoEmail = req.headers['x-demo-email'];

  if (demoRole) {
    req.user = {
      id: `usr-${demoRole}`,
      email: demoEmail || `${demoRole}@disasteros.gov`,
      role: demoRole,
      full_name: `${demoRole.toUpperCase()} Operator`,
      is_demo: true
    };
    return next();
  }

  if (!authHeader) {
    // Default to citizen if unauthenticated public request
    req.user = {
      id: "usr-guest-citizen",
      email: "guest.citizen@emergency.local",
      role: "citizen",
      is_guest: true
    };
    return next();
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: "Missing authentication bearer token" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired authentication token" });
  }
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (req.user.role === 'admin') {
      // System admin has omnibus access
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Access Denied: Insufficient Role Permissions",
        required_roles: allowedRoles,
        user_role: req.user.role
      });
    }

    next();
  };
}
