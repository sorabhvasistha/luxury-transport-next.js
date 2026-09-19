// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {

    const hashedPassword = await bcrypt.hash('password123', 10);
    await prisma.admin.upsert({
    where: { email: 'admin@luxeride.com' },
    update: {},
    create: {
        email: 'admin@luxeride.com',
        password: hashedPassword,
    },
    });

  // Clear existing vehicles to prevent duplicates if run multiple times
  await prisma.vehicle.deleteMany();

  await prisma.vehicle.createMany({
    data: [
      {
        name: 'Mercedes-Benz S-Class',
        class: 'Luxury Sedan',
        passengers: 3,
        luggage: 3,
        imageUrl: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=1000&auto=format&fit=crop',
        hourlyRate: 150,
        description: 'The ultimate in luxury and comfort for executive travel.',
      },
      {
        name: 'Cadillac Escalade',
        class: 'Luxury SUV',
        passengers: 6,
        luggage: 6,
        imageUrl: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=1000&auto=format&fit=crop',
        hourlyRate: 200,
        description: 'Spacious and commanding, perfect for group travel and airport transfers.',
      },
      {
        name: 'BMW 7 Series',
        class: 'Luxury Sedan',
        passengers: 3,
        luggage: 3,
        imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000&auto=format&fit=crop',
        hourlyRate: 140,
        description: 'Sleek, modern, and engineered for a flawlessly smooth ride.',
      }
    ],
  });
  console.log('Database seeded with vehicles!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });