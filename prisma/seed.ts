import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create the company
  const company = await prisma.company.create({
    data: {
      name: 'ALTERNATIVES AFRICA LIMITED',
      registrationNumber: 'CPR/2014/149898',
      registrationDate: new Date('2014-10-14'),
      status: 'ACTIVE',
      address: {
        create: {
          street: 'MSUPI ROAD NAIROBI WEST NAIROBI',
          building: 'L.R.NO.37/489/108-7',
          postalAddress: 'P.O BOX 73431 00200',
        },
      },
      contactInfo: {
        create: {
          email: null,
          phone: null,
        },
      },
      directors: {
        create: [
          {
            name: 'ARTHUR KONYE IGERIA',
            role: 'SECRETARY',
            nationality: null,
            address: null,
          },
          {
            name: 'MACHARIA GAITHO',
            role: 'DIRECTOR',
            nationality: 'KENYA',
            address: 'P.O BOX 73431 CITY SQUARE',
          },
          {
            name: 'CAROLINE WAITHERA GAITHO',
            role: 'DIRECTOR',
            nationality: 'KENYA',
            address: 'P.O BOX 73431 CITY SQUARE',
          },
        ],
      },
    },
  });

  console.log('Seeded company:', company);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });