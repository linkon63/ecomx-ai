import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/auth-server';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await hashPassword('admin123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@shoex.com' },
    update: {},
    create: {
      email: 'admin@shoex.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isActive: true,
    },
  });

  // Create staff user
  const staffPassword = await hashPassword('staff123');
  const staff = await prisma.user.upsert({
    where: { email: 'staff@shoex.com' },
    update: {},
    create: {
      email: 'staff@shoex.com',
      password: staffPassword,
      firstName: 'Staff',
      lastName: 'User',
      role: 'STAFF',
      isActive: true,
    },
  });

  // Create customer user
  const customerPassword = await hashPassword('customer123');
  const customer = await prisma.user.upsert({
    where: { email: 'customer@shoex.com' },
    update: {},
    create: {
      email: 'customer@shoex.com',
      password: customerPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: 'CUSTOMER',
      isActive: true,
    },
  });

  // Create categories
  const sneakersCategory = await prisma.category.upsert({
    where: { slug: 'sneakers' },
    update: {},
    create: {
      name: 'Sneakers',
      slug: 'sneakers',
      description: 'Comfortable and stylish sneakers for everyday wear',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500',
      isActive: true,
    },
  });

  const bootsCategory = await prisma.category.upsert({
    where: { slug: 'boots' },
    update: {},
    create: {
      name: 'Boots',
      slug: 'boots',
      description: 'Durable boots for all weather conditions',
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500',
      isActive: true,
    },
  });

  const sandalsCategory = await prisma.category.upsert({
    where: { slug: 'sandals' },
    update: {},
    create: {
      name: 'Sandals',
      slug: 'sandals',
      description: 'Comfortable sandals for summer',
      image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500',
      isActive: true,
    },
  });

  // Create category variants
  await prisma.categoryVariant.createMany({
    data: [
      // Sneakers variants
      { categoryId: sneakersCategory.id, type: 'SIZE', name: 'Size Options', options: ['7', '8', '9', '10', '11'] },
      { categoryId: sneakersCategory.id, type: 'COLOR', name: 'Color Options', options: ['white', 'black', 'red'] },
      // Boots variants
      { categoryId: bootsCategory.id, type: 'SIZE', name: 'Size Options', options: ['7', '8', '9', '10'] },
      { categoryId: bootsCategory.id, type: 'COLOR', name: 'Color Options', options: ['brown', 'black'] },
      { categoryId: bootsCategory.id, type: 'MATERIAL', name: 'Material Options', options: ['leather', 'suede'] },
      // Sandals variants
      { categoryId: sandalsCategory.id, type: 'SIZE', name: 'Size Options', options: ['6', '7', '8', '9', '10'] },
      { categoryId: sandalsCategory.id, type: 'COLOR', name: 'Color Options', options: ['tan', 'black', 'white'] },
    ],
    skipDuplicates: true,
  });

  // Create products
  const products = [
    {
      name: 'Air Max Classic',
      slug: 'air-max-classic',
      description: 'Classic Air Max sneakers with superior comfort and style.',
      shortDescription: 'Classic Air Max sneakers',
      price: 129.99,
      discountedPrice: 99.99,
      sku: 'AMC-001',
      stockQuantity: 50,
      isActive: true,
      isFeatured: true,
      weight: 0.8,
      dimensions: '12x8x5 inches',
      categoryId: sneakersCategory.id,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
          alt: 'Air Max Classic - Main',
          isMain: true,
          sortOrder: 1,
        },
        {
          url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500',
          alt: 'Air Max Classic - Side',
          isMain: false,
          sortOrder: 2,
        },
      ],
    },
    {
      name: 'Urban Runner',
      slug: 'urban-runner',
      description: 'Perfect running shoes for urban environments with excellent grip.',
      shortDescription: 'Urban running shoes',
      price: 89.99,
      sku: 'UR-002',
      stockQuantity: 30,
      isActive: true,
      isFeatured: false,
      weight: 0.7,
      dimensions: '12x8x5 inches',
      categoryId: sneakersCategory.id,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500',
          alt: 'Urban Runner - Main',
          isMain: true,
          sortOrder: 1,
        },
      ],
    },
    {
      name: 'Leather Work Boots',
      slug: 'leather-work-boots',
      description: 'Durable leather work boots built for tough conditions.',
      shortDescription: 'Durable work boots',
      price: 199.99,
      sku: 'LWB-003',
      stockQuantity: 25,
      isActive: true,
      isFeatured: true,
      weight: 1.2,
      dimensions: '13x9x6 inches',
      categoryId: bootsCategory.id,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500',
          alt: 'Leather Work Boots - Main',
          isMain: true,
          sortOrder: 1,
        },
      ],
    },
    {
      name: 'Summer Comfort Sandals',
      slug: 'summer-comfort-sandals',
      description: 'Lightweight and comfortable sandals perfect for summer.',
      shortDescription: 'Comfortable summer sandals',
      price: 49.99,
      sku: 'SCS-004',
      stockQuantity: 40,
      isActive: true,
      isFeatured: false,
      weight: 0.3,
      dimensions: '11x4x2 inches',
      categoryId: sandalsCategory.id,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500',
          alt: 'Summer Comfort Sandals - Main',
          isMain: true,
          sortOrder: 1,
        },
      ],
    },
  ];

  for (const productData of products) {
    const { images, categoryId, ...product } = productData;
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...product,
        categories: {
          connect: { id: categoryId },
        },
        images: {
          create: images,
        },
      },
    });
  }

  // Get products for order
  const airMaxProduct = await prisma.product.findUnique({ where: { slug: 'air-max-classic' } });
  const urbanRunnerProduct = await prisma.product.findUnique({ where: { slug: 'urban-runner' } });

  // Create sample order
  const sampleOrder = await prisma.order.create({
    data: {
      orderNumber: 'ORD-000001',
      userId: customer.id,
      status: 'PENDING',
      subtotal: 179.98,
      taxAmount: 18.00,
      shippingAmount: 0,
      totalAmount: 197.98,
      customerEmail: customer.email,
      shippingAddress: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'ST',
        zipCode: '12345',
        country: 'USA'
      },
      billingAddress: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'ST',
        zipCode: '12345',
        country: 'USA'
      },
      items: {
        create: [
          {
            productId: airMaxProduct!.id,
            quantity: 1,
            unitPrice: 99.99,
            totalPrice: 99.99,
            productName: airMaxProduct!.name,
            productSku: airMaxProduct!.sku,
          },
          {
            productId: urbanRunnerProduct!.id,
            quantity: 1,
            unitPrice: 89.99,
            totalPrice: 89.99,
            productName: urbanRunnerProduct!.name,
            productSku: urbanRunnerProduct!.sku,
          },
        ],
      },
    },
  });

  // Create payment for the order
  await prisma.payment.create({
    data: {
      orderId: sampleOrder.id,
      amount: 197.98,
      status: 'COMPLETED',
      method: 'CREDIT_CARD',
      transactionId: 'txn_sample_123',
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('👤 Admin user: admin@shoex.com / admin123');
  console.log('👤 Staff user: staff@shoex.com / staff123');
  console.log('👤 Customer user: customer@shoex.com / customer123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
