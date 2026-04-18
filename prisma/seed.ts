const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@smarttech.com";
  const adminPassword = "password123"; // Reset this in production!

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const user = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: "Administrator",
        role: "ADMIN",
      },
    });
    console.log("Admin user created:", user);
  } else {
    console.log("Admin user already exists");
  }

  // Create initial categories
  const categories = ["Tech News", "Free Games", "Free Software", "PC Tips"];
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat },
      update: {},
      create: { 
        name: cat,
        slug: cat.toLowerCase().replace(/ /g, "-")
      },
    });
  }

  // Create initial settings
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      siteName: "SMART",
      siteTitle: "GUIDE",
      heroTitle: "MASTER YOUR TECH",
      heroSubtitle: "Premium guides and tips for the modern digital life.",
      footerText: "Smart Tips, Better You."
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
