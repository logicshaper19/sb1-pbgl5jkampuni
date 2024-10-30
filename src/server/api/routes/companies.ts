import { Router } from 'express';
import type { RequestHandler } from 'express';
import { prisma } from '../../index';

const router = Router();

router.get('/test', async (_req, res) => {
  const count = await prisma.company.count();
  const companies = await prisma.company.findMany({
    take: 2,
    include: {
      directors: true
    }
  });
  res.json({ count, companies });
});

const searchHandler: RequestHandler = async (req, res) => {
  try {
    const q = req.query.q;
    console.log('Received query:', q);
    
    if (!q || typeof q !== 'string') {
      res.status(400).json({ 
        error: 'Invalid search query',
        details: `Query must be a string, received ${typeof q}`
      });
      return;
    }

    console.log('Executing Prisma query with:', q);

    const companies = await prisma.company.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { registrationNumber: { contains: q, mode: 'insensitive' } },
          {
            directors: {
              some: {
                name: { contains: q, mode: 'insensitive' }
              }
            }
          }
        ]
      },
      include: {
        directors: true,
        address: true,
        contactInfo: true
      }
    });

    console.log('Query results:', companies);

    res.status(200).json({
      query: q,
      count: companies.length,
      results: companies
    });
  } catch (error) {
    console.error('Search error details:', error);
    res.status(500).json({ 
      error: 'Failed to search companies',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

router.get('/search', searchHandler);

export default router;