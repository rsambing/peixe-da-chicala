require("dotenv").config();
const { PrismaClient } = require("./generated/prisma");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function teste() {
  try {
    await prisma.$connect();
    console.log("Conectado ao banco de dados!");
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
  } finally {
    await prisma.$disconnect();
    console.log("Conexão encerrada!");
  }
}

teste();