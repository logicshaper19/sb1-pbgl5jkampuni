import express from 'express';
import cors from 'cors';
import { prisma } from '../lib/prisma';
import companiesRouter from './api/routes/companies';

const app = express();

// More specific CORS configuration
app.use(cors({
  origin: ['http://localhost:3002'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/companies', companiesRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});