import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  //company
  await prisma.company.create({
    data: {
      id: "2024000001",
      name: "San Carlos Bioenergy, Inc.",
      alias: "SCBI",
      address: "San Carlos City, Negros Occidental",
      feedstock: "Sugarcane",
      createdAt: "2024-11-10T16:00:00+08:00",
    },
  });
  await prisma.company.create({
    data: {
      id: "2024000002",
      name: "Leyte Agri Corp.",
      alias: "LAC",
      address: "Ormoc City, Leyte",
      feedstock: "Molasses",
      createdAt: "2024-11-10T16:00:00+08:00",
    },
  });
  await prisma.company.create({
    data: {
      id: "2024000003",
      name: "Roxol Bioenergy Corp.",
      alias: "RBC",
      address: "La Carlota City, Negros Occidental",
      feedstock: "Molasses",
      createdAt: "2024-11-10T16:00:00+08:00",
    },
  });
  await prisma.company.create({
    data: {
      id: "2024000004",
      name: "Green Future Innovations, Inc.",
      alias: "GFII",
      address: "San Mariano, Isabela",
      feedstock: "Sugarcane",
      createdAt: "2024-11-10T16:00:00+08:00",
    },
  });
  await prisma.company.create({
    data: {
      id: "2024000005",
      name: "Balayan Distillery, Incorporated",
      alias: "BDI",
      address: "Calaca, Batangas",
      feedstock: "Molasses",
      createdAt: "2024-11-10T16:00:00+08:00",
    },
  });
  await prisma.company.create({
    data: {
      id: "2024000006",
      name: "Far East Alcohol Corporation",
      alias: "FEAC",
      address: "Apalit, Pampanga",
      feedstock: "Molasses",
      createdAt: "2024-11-10T16:00:00+08:00",
    },
  });
  await prisma.company.create({
    data: {
      id: "2024000007",
      name: "Kooll Company Inc.",
      alias: "KCI",
      address: "Talisay City, Negros Occidental",
      feedstock: "Molasses",
      createdAt: "2024-11-10T16:00:00+08:00",
    },
  });
  await prisma.company.create({
    data: {
      id: "2024000008",
      name: "Universal Robina Corporation",
      alias: "URC",
      address: "Bais City, Negros Oriental",
      feedstock: "Molasses",
      createdAt: "2024-11-10T16:00:00+08:00",
    },
  });
  await prisma.company.create({
    data: {
      id: "2024000009",
      name: "Absolut Distillers Inc.",
      alias: "ADI",
      address: "Lian, Batangas",
      feedstock: "Molasses",
      createdAt: "2024-11-10T16:00:00+08:00",
    },
  });
  await prisma.company.create({
    data: {
      id: "2024000010",
      name: "Progreen Agricorp Inc. - Nasugbu",
      alias: "PAIN",
      address: "Nasugbu, Batangas",
      feedstock: "Molasses",
      createdAt: "2024-11-10T16:00:00+08:00",
    },
  });
  await prisma.company.create({
    data: {
      id: "2024000011",
      name: "Progreen Agricorp Inc. - Balayan",
      alias: "PAIB",
      address: "Nasugbu, Batangas",
      feedstock: "Molasses",
      createdAt: "2024-11-10T16:00:00+08:00",
    },
  });
  await prisma.company.create({
    data: {
      id: "2024000012",
      name: "Victorias Milling Company, Inc.",
      alias: "VMCI",
      address: "Victorias City, Negros Occidental",
      feedstock: "Sugarcane",
      createdAt: "2024-11-10T16:00:00+08:00",
    },
  });
  await prisma.company.create({
    data: {
      id: "2024000013",
      name: "Asian Alcohol Corporation",
      alias: "AAC",
      address: "Alijis Road Bacolod, Negros Occidental",
      feedstock: "Molasses",
      createdAt: "2024-11-10T16:00:00+08:00",
    },
  });

  await prisma.consumer.create({
    data: {
      id: "2024000100",
      name: "Petron",
      createdAt: "2024-11-10T16:00:00+08:00",
    },
  });
  await prisma.consumer.create({
    data: {
      id: "2024000101",
      name: "Shell",
      createdAt: "2024-11-10T16:00:00+08:00",
    },
  });
  await prisma.consumer.create({
    data: {
      id: "2024000102",
      name: "Chevron",
      createdAt: "2024-11-10T16:00:00+08:00",
    },
  });
  await prisma.consumer.create({
    data: {
      id: "2024000103",
      name: "Total",
      createdAt: "2024-11-10T16:00:00+08:00",
    },
  });
  await prisma.consumer.create({
    data: {
      id: "2024000104",
      name: "Seaoil",
      createdAt: "2024-11-10T16:00:00+08:00",
    },
  });
  await prisma.consumer.create({
    data: {
      id: "2024000105",
      name: "Insular Oil",
      createdAt: "2024-11-10T16:00:00+08:00",
    },
  });
  await prisma.consumer.create({
    data: {
      id: "2024000106",
      name: "Flying V",
      createdAt: "2024-11-10T16:00:00+08:00",
    },
  });
  await prisma.consumer.create({
    data: {
      id: "2024000107",
      name: "Unioil",
      createdAt: "2024-11-10T16:00:00+08:00",
    },
  });
  await prisma.consumer.create({
    data: {
      id: "2024000108",
      name: "Phoenix",
      createdAt: "2024-11-10T16:00:00+08:00",
    },
  });
  await prisma.consumer.create({
    data: {
      id: "2024000109",
      name: "PTT",
      createdAt: "2024-11-10T16:00:00+08:00",
    },
  });
  await prisma.consumer.create({
    data: {
      id: "2024000110",
      name: "Jetti",
      createdAt: "2024-11-10T16:00:00+08:00",
    },
  });
  await prisma.consumer.create({
    data: {
      id: "2024000111",
      name: "Marubeni",
      createdAt: "2024-11-10T16:00:00+08:00",
    },
  });
  await prisma.consumer.create({
    data: {
      id: "2024000112",
      name: "Filoil",
      createdAt: "2024-11-10T16:00:00+08:00",
    },
  });

  console.log("Seeding completed successfully.");
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
