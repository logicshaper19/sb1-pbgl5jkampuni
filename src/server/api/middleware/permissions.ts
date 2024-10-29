import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const requirePermission = (permissionName: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        include: { permissions: true },
      });

      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Admin role bypasses permission check
      if (user.role === 'ADMIN') {
        return next();
      }

      const hasPermission = user.permissions.some(p => p.name === permissionName);
      if (!hasPermission) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      next();
    } catch (error) {
      console.error('Permission check failed:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};