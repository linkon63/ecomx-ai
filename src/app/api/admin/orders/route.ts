import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth-server';
import { z } from 'zod';

const orderUpdateSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']).optional(),
  trackingNumber: z.string().optional(),
  notes: z.string().optional(),
});

// GET /api/admin/orders - Get all orders with pagination and filters
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('auth-token')?.value;
    
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } },
        { customerEmail: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  images: {
                    where: { isMain: true },
                    take: 1,
                  },
                },
              },
            },
          },
          payments: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/orders - Create new order (admin only)
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('auth-token')?.value;
    
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    
    const orderSchema = z.object({
      userId: z.string().optional(),
      customerEmail: z.string().email(),
      customerPhone: z.string().optional(),
      items: z.array(z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
        unitPrice: z.number().positive(),
        productName: z.string(),
        productSku: z.string().optional(),
      })),
      shippingAddress: z.object({}),
      billingAddress: z.object({}).optional(),
      notes: z.string().optional(),
    });

    const validatedData = orderSchema.parse(body);

    // Generate order number
    const orderCount = await prisma.order.count();
    const orderNumber = `ORD-${(orderCount + 1).toString().padStart(6, '0')}`;

    // Calculate totals
    const subtotal = validatedData.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    const taxAmount = subtotal * 0.1; // 10% tax
    const shippingAmount = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const totalAmount = subtotal + taxAmount + shippingAmount;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: validatedData.userId,
        customerEmail: validatedData.customerEmail,
        customerPhone: validatedData.customerPhone,
        status: 'PENDING',
        subtotal,
        taxAmount,
        shippingAmount,
        totalAmount,
        shippingAddress: validatedData.shippingAddress,
        billingAddress: validatedData.billingAddress || validatedData.shippingAddress,
        notes: validatedData.notes,
        items: {
          create: validatedData.items.map(item => ({
            ...item,
            totalPrice: item.unitPrice * item.quantity
          })),
        },
      },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Create order error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
