import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Search companies
router.get('/search', async (req, res) => {
  const { q } = req.query;
  
  try {
    const companies = await prisma.company.findMany({
      where: {
        OR: [
          { name: { contains: q as string, mode: 'insensitive' } },
          { registrationNumber: { contains: q as string, mode: 'insensitive' } },
          {
            directors: {
              some: {
                name: { contains: q as string, mode: 'insensitive' }
              }
            }
          }
        ]
      },
      include: {
        address: true,
        contactInfo: true,
        directors: true,
        shareholders: true,
        encumbrances: true,
        tenders: true,
        financialResults: true,
      }
    });

    res.json(companies);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Get company by ID
router.get('/:id', async (req, res) => {
  try {
    const company = await prisma.company.findUnique({
      where: { id: req.params.id },
      include: {
        address: true,
        contactInfo: true,
        directors: true,
        shareholders: true,
        encumbrances: true,
        tenders: true,
        financialResults: true,
      }
    });

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json(company);
  } catch (error) {
    console.error('Get company error:', error);
    res.status(500).json({ error: 'Failed to fetch company' });
  }
});

export default router;