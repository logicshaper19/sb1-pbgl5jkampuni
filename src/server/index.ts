import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import companiesRouter from './api/routes/companies';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/companies', companiesRouter);

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await prisma.$connect();
    console.log('Connected to database');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();