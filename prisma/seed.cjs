const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // First company (ALTERNATIVES AFRICA LIMITED)
  const address1 = await prisma.address.create({
    data: {
      street: "MSUPI ROAD NAIROBI WEST NAIROBI",
      building: "L.R.NO.37/489/108-7",
      postalAddress: "P.O BOX 73431 00200",
      county: null,
      district: null,
      locality: null
    }
  });

  await prisma.company.create({
    data: {
      name: "ALTERNATIVES AFRICA LIMITED",
      registrationNumber: "CPR/2014/149898",
      registrationDate: new Date("2014-10-14"),
      status: "ACTIVE",
      addressId: address1.id,
      directors: {
        create: [
          {
            name: "ARTHUR KONYE IGERIA",
            role: "SECRETARY",
            nationality: null
          },
          {
            name: "MACHARIA GAITHO",
            role: "DIRECTOR",
            nationality: "KENYA",
            address: "P.O BOX 73431 CITY SQUARE"
          },
          {
            name: "CAROLINE WAITHERA GAITHO",
            role: "DIRECTOR",
            nationality: "KENYA",
            address: "P.O BOX 73431 CITY SQUARE"
          }
        ]
      }
    }
  });

  // Second company (SIH AFRICA LIMITED)
  const address2 = await prisma.address.create({
    data: {
      street: "TRIFIC ROAD",
      building: "TRIFIC BUILDING",
      postalAddress: "P.O BOX 10518 G.P.O NAIROBI",
      county: "NAIROBI",
      district: "STAREHE",
      locality: "CBD"
    }
  });

  await prisma.company.create({
    data: {
      name: "SIH AFRICA LIMITED",
      registrationNumber: "PVT-8LU2QG3Z",
      registrationDate: new Date("2024-07-03"),
      status: "ACTIVE",
      addressId: address2.id,
      directors: {
        create: [
          {
            name: "ASWANTH BINDHU LAMBODARAN",
            role: "DIRECTOR/SHAREHOLDER",
            nationality: "INDIA",
            address: "P.O BOX TRIFIC (TWO RIVERS INTERNATIONAL FINANCE & INNOVATION CENTRE) P.O. BOX 10518-00100 NAIROBI, KENYA"
          },
          {
            name: "NISHANT MISHRA",
            role: "DIRECTOR/SHAREHOLDER",
            nationality: "KENYA",
            address: "P.O BOX 10518 G.P.O NAIROBI"
          },
          {
            name: "RUFUS MARUNDU MAINA",
            role: "DIRECTOR",
            nationality: "KENYAN",
            address: "P.O BOX 10518 G.P.O NAIROBI"
          }
        ]
      },
      shareholders: {
        create: [
          {
            name: "ASWANTH BINDHU LAMBODARAN",
            shares: 500,
            nationality: "INDIA"
          },
          {
            name: "NISHANT MISHRA",
            shares: 500,
            nationality: "KENYA"
          }
        ]
      }
    }
  });

  // Third company (BLISS HEALTHCARE LIMITED)
  const address3 = await prisma.address.create({
    data: {
      street: "LENANA ROAD",
      building: "LAIBONI CENTRE",
      postalAddress: "P.O BOX 5763 CITY SQUARE",
      county: "NAIROBI",
      district: "WESTLANDS",
      locality: "KILIMANI"
    }
  });

  const contactInfo3 = await prisma.contactInfo.create({
    data: {
      email: "IJAKAAHUMPHREY@GMAIL.COM",
      phone: "+254726057838"
    }
  });

  await prisma.company.create({
    data: {
      name: "BLISS HEALTHCARE LIMITED",
      registrationNumber: "CPR/2012/65082",
      registrationDate: new Date("2012-02-15"),
      status: "ACTIVE",
      addressId: address3.id,
      contactInfoId: contactInfo3.id,
      directors: {
        create: [
          {
            name: "JAYESH UMESH SAINI",
            role: "DIRECTOR",
            nationality: "KENYAN",
            address: "P.O BOX 43375 G.P.O NAIROBI"
          },
          {
            name: "ANJELINE AKELLO OTIENO",
            role: "SECRETARY",
            nationality: "KENYAN",
            address: "P.O BOX 31295 NGARAROAD"
          }
        ]
      },
      shareholders: {
        create: [
          {
            name: "MAYFAIR HEALTHCARE HOLDINGS LIMITED",
            shares: 1000000,
            nationality: "N/A",
            address: "P.O BOX AL SILA TOWER, ADGM SQUARE, AL MARYAH ISLAND, ABU DHABI UNITED ARAB EMIRATES"
          }
        ]
      },
      encumbrances: {
        create: [
          {
            type: "SUPPLEMENTAL DEBENTURE",
            amount: 680000000,
            date: new Date("2017-06-01"),
            status: "ACTIVE",
            description: "SUPPLEMENTAL DEBENTURE"
          },
          {
            type: "SECOND SUPPLEMENTAL DEBENTURE",
            amount: 3264321755,
            date: new Date("2022-12-15"),
            status: "ACTIVE",
            description: "SECOND SUPPLEMENTAL DEBENTURE"
          }
        ]
      }
    }
  });

  // Fourth company (MOTREX LIMITED)
  const address4 = await prisma.address.create({
    data: {
      street: "MOMBASA-NAIROBI HIGHWAY",
      building: "MN/V/569",
      postalAddress: "P.O BOX 87006 MOMBASA G.P.O",
      county: "MOMBASA",
      district: "CHANGAMWE",
      locality: "MIKINDANI"
    }
  });

  const contactInfo4 = await prisma.contactInfo.create({
    data: {
      email: "MOTREX@MOTREXLTD.CO.KE",
      phone: "+254726666271"
    }
  });

  await prisma.company.create({
    data: {
      name: "MOTREX LIMITED",
      registrationNumber: "C.28295",
      registrationDate: new Date("1984-10-04"),
      status: "ACTIVE",
      addressId: address4.id,
      contactInfoId: contactInfo4.id,
      directors: {
        create: [
          {
            name: "NAIM IQBAL AHMED BAYUSUF",
            role: "DIRECTOR/SHAREHOLDER",
            nationality: "KENYAN",
            address: "P.O BOX 87006 MOMBASA G.P.O"
          },
          {
            name: "HAMDAN IQBAL BAYUSUF",
            role: "DIRECTOR/SHAREHOLDER",
            nationality: "KENYAN",
            address: "P.O BOX 87006 MOMBASA G.P.O"
          },
          {
            name: "IQBAL AHMED BAYUSUF",
            role: "DIRECTOR",
            nationality: "KENYAN",
            address: "P.O BOX 87006 BAMBURI"
          },
          {
            name: "RICHARD NYAMAI MWANIKI",
            role: "DIRECTOR",
            nationality: "KENYAN",
            address: "P.O BOX 87006 MOMBASA G.P.O"
          },
          {
            name: "SWALEH ATHUMANI MWAKWAZA",
            role: "DIRECTOR",
            nationality: "KENYAN",
            address: "P.O BOX 87006 MOMBASA G.P.O"
          },
          {
            name: "ISLAM SALEH BAYUSUF",
            role: "DIRECTOR",
            nationality: "KENYAN",
            address: "P.O BOX 87006 MOMBASA G.P.O"
          },
          {
            name: "FAHAD IQBAL AHMED BAYUSUF",
            role: "DIRECTOR/SHAREHOLDER",
            nationality: "KENYAN",
            address: "P.O BOX 87006 MOMBASA G.P.O"
          },
          {
            name: "MOMBASA COMPANY SECRETARIES",
            role: "SECRETARY",
            nationality: "N/A"
          }
        ]
      },
      shareholders: {
        create: [
          {
            name: "NAIM IQBAL AHMED BAYUSUF",
            shares: 3600,
            nationality: "KENYAN"
          },
          {
            name: "HAMDAN IQBAL BAYUSUF",
            shares: 3600,
            nationality: "KENYAN"
          },
          {
            name: "FAHAD IQBAL AHMED BAYUSUF",
            shares: 7800,
            nationality: "KENYAN"
          }
        ]
      }
    }
  });

  // Fifth company (FASOMO LIMITED)
  const address5 = await prisma.address.create({
    data: {
      street: "POPO ROAD",
      building: "VENUS PLAZA",
      postalAddress: "P.O BOX 28883 G.P.O NAIROBI",
      county: "NAIROBI",
      district: "LANGATA",
      locality: "SOUTH C"
    }
  });

  const contactInfo5 = await prisma.contactInfo.create({
    data: {
      email: "FEIZAYUSSUFABDILLE@GMAIL.COM",
      phone: "+254748167856"
    }
  });

  await prisma.company.create({
    data: {
      name: "FASOMO LIMITED",
      registrationNumber: "PVT-PJUL9GR",
      registrationDate: new Date("2019-10-11"),
      status: "ACTIVE",
      addressId: address5.id,
      contactInfoId: contactInfo5.id,
      directors: {
        create: [
          {
            name: "SIMON PAUL BALONGO",
            role: "DIRECTOR/SHAREHOLDER",
            nationality: "KENYA",
            address: "P.O BOX 28889 G.P.O NAIROBI"
          },
          {
            name: "FEIZA YUSSUF ABDILLE",
            role: "DIRECTOR/SHAREHOLDER",
            nationality: "KENYA",
            address: "P.O BOX 28880 G.P.O NAIROBI"
          }
        ]
      },
      shareholders: {
        create: [
          {
            name: "SIMON PAUL BALONGO",
            shares: 30,
            nationality: "KENYA"
          },
          {
            name: "FEIZA YUSSUF ABDILLE",
            shares: 60,
            nationality: "KENYA"
          }
        ]
      }
    }
  });

  // Sixth company (PRIORITY HEALTH LIMITED)
  const address6 = await prisma.address.create({
    data: {
      street: "PLOT NO 209/4291 KILIMANI ROAD NAIROBI",
      building: "PLOT NO 209/4291 KILIMANI ROAD NAIROBI",
      postalAddress: "P.O BOX 16282 G.P.O NAIROBI",
      county: null,
      district: null,
      locality: null
    }
  });

  const contactInfo6 = await prisma.contactInfo.create({
    data: {
      email: "ELISHA.SORE@GMAIL.COM",
      phone: "+254722326618"
    }
  });

  await prisma.company.create({
    data: {
      name: "PRIORITY HEALTH LIMITED",
      registrationNumber: "CPR/2014/150426",
      registrationDate: new Date("2014-07-09"),
      status: "ACTIVE",
      addressId: address6.id,
      contactInfoId: contactInfo6.id,
      directors: {
        create: [
          {
            name: "CORNEILLE CHITAYI SORE",
            role: "DIRECTOR/SHAREHOLDER",
            nationality: "KENYAN",
            address: "P.O BOX 16282 G.P.O NAIROBI"
          },
          {
            name: "ELISHA LIYAI SORE",
            role: "DIRECTOR/SHAREHOLDER",
            nationality: "KENYAN",
            address: "P.O BOX 16282 G.P.O NAIROBI"
          },
          {
            name: "STELLA W NYAMU",
            role: "SECRETARY",
            nationality: "N/A"
          }
        ]
      },
      shareholders: {
        create: [
          {
            name: "CORNEILLE CHITAYI SORE",
            shares: 100,
            nationality: "KENYAN"
          },
          {
            name: "ELISHA LIYAI SORE",
            shares: 550,
            nationality: "KENYAN"
          }
        ]
      }
    }
  });

  // Seventh company (PRIORITY MOBILE LIMITED)
  const address7 = await prisma.address.create({
    data: {
      street: "KIPANDE ROAD",
      building: "L.R.NO.209/386/11 SHIRIKA CO-OP HOUSE",
      postalAddress: "P.O BOX 2004 CITY SQUARE",
      county: null,
      district: null,
      locality: null
    }
  });

  await prisma.company.create({
    data: {
      name: "PRIORITY MOBILE LIMITED",
      registrationNumber: "CPR/2014/137614",
      registrationDate: new Date("2014-03-31"),
      status: "ACTIVE",
      addressId: address7.id,
      directors: {
        create: [
          {
            name: "PATRICK N NJEHIA",
            role: "SECRETARY",
            nationality: "N/A"
          },
          {
            name: "ELISHA LIYAI SORE",
            role: "DIRECTOR/SHAREHOLDER",
            nationality: "KENYAN",
            address: "P.O BOX 16282 G.P.O NAIROBI"
          },
          {
            name: "WINSTON SHITSUKANE SORE",
            role: "DIRECTOR/SHAREHOLDER",
            nationality: "KENYAN",
            address: "P.O BOX 16282 G.P.O NAIROBI"
          }
        ]
      },
      shareholders: {
        create: [
          {
            name: "ELISHA LIYAI SORE",
            shares: 1,
            nationality: "KENYAN"
          },
          {
            name: "WINSTON SHITSUKANE SORE",
            shares: 1,
            nationality: "KENYAN"
          }
        ]
      }
    }
  });

  // Eighth company (AERIAL AFFAIRS LIMITED)
  const address8 = await prisma.address.create({
    data: {
      street: "USIU ROAD",
      building: "MOUNTAIN VIEW SUITES",
      postalAddress: "P.O BOX 64740 MOBIL PLAZA",
      county: null,
      district: null,
      locality: null
    }
  });

  const contactInfo8 = await prisma.contactInfo.create({
    data: {
      email: "AERIALAFFAIRSAFRICA@GMAIL.COM",
      phone: "+254708918011"
    }
  });

  await prisma.company.create({
    data: {
      name: "AERIAL AFFAIRS LIMITED",
      registrationNumber: "PVT/2016/012903",
      registrationDate: new Date("2016-06-21"),
      status: "ACTIVE",
      addressId: address8.id,
      contactInfoId: contactInfo8.id,
      directors: {
        create: [
          {
            name: "TITUS GICHEHA NDERITU",
            role: "DIRECTOR/SHAREHOLDER",
            nationality: "KENYAN",
            address: "P.O BOX 64740 MOBIL PLAZA"
          },
          {
            name: "SAMUEL LLOYD MUCHAI KAMAU",
            role: "DIRECTOR/SHAREHOLDER",
            nationality: "KENYAN",
            address: "P.O BOX 64740 MOBIL PLAZA"
          }
        ]
      },
      shareholders: {
        create: [
          {
            name: "TITUS GICHEHA NDERITU",
            shares: 300,
            nationality: "KENYAN"
          },
          {
            name: "SAMUEL LLOYD MUCHAI KAMAU",
            shares: 700,
            nationality: "KENYAN"
          }
        ]
      }
    }
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
