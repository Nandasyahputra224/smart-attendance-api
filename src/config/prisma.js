import { PrismaClient } from "@prisma/client";

/** @type {import('@prisma/client').PrismaClient} */
const prisma = new PrismaClient();

async function checkDbConnect() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1); // matikan server jika database gagal konek
  }
}

checkDbConnect();

export default prisma;
