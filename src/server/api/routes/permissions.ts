import express from 'express';
import { z } from 'zod';
import { prisma } from '../db';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';

const router = express.Router();

const permissionSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});

// Get all permissions
router.get('/', requireAuth, async (req, res) => {
  try {
    const permissions = await prisma.permission.findMany();
    res.json(permissions);
  } catch (error) {
    console.error('Failed to fetch permissions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create permission (admin only)
router.post('/', requireAdmin, validateRequest(permissionSchema), async (req, res) => {
  try {
    const permission = await prisma.permission.create({
      data: req.body,
    });
    res.status(201).json(permission);
  } catch (error) {
    console.error('Failed to create permission:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete permission (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.permission.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Failed to delete permission:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Assign permissions to user (admin only)
router.post('/assign', requireAdmin, async (req, res) => {
  const { userId, permissionIds } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        permissions: {
          connect: permissionIds.map((id: string) => ({ id })),
        },
      },
      include: {
        permissions: true,
      },
    });
    res.json(user);
  } catch (error) {
    console.error('Failed to assign permissions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Remove permissions from user (admin only)
router.post('/revoke', requireAdmin, async (req, res) => {
  const { userId, permissionIds } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        permissions: {
          disconnect: permissionIds.map((id: string) => ({ id })),
        },
      },
      include: {
        permissions: true,
      },
    });
    res.json(user);
  } catch (error) {
    console.error('Failed to revoke permissions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;