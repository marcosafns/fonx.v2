import { Controller, Post, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaClient } from '../../generated/prisma';
import axios from 'axios';

const prisma = new PrismaClient();

@Controller('checkout')
export class CheckoutController {
  @UseGuards(JwtAuthGuard)
  @Post()
  async createCheckout(@Req() req) {
    const userId = req.user.id;

    const cart = await prisma.cart_items.findMany({
      where: { user_id: userId },
    });

    if (!cart.length) return { message: 'Cart is empty' };

    const products = cart.map(item => ({
      product_sku: item.product_name, // aqui você pode trocar por SKU real
      quantity: item.quantity || 1,
    }));

    const headers = {
      'Content-Type': 'application/json',
      'User-Token': 'DSkXW9gH1ljtGxVpLP3t5ozFsyKZpU2iRLLKlX7l',
      'User-Secret-Key': 'sk_5uFsBbKJBQQGUo1In6doEsWM7cREs1nQGTXE7',
    };

    const response = await axios.post(
      'https://api.yampi.com.br/v1/orders',
      {
        customer: {
          email: req.user.email,
        },
        products,
      },
      { headers }
    );

    const order = response.data;

    await prisma.orders.create({
      data: {
        user_id: userId,
        yampi_order_id: order.id,
        status: 'pending',
      },
    });

    return {
      message: 'Checkout created successfully!',
      redirect_url: order.checkout_url,
    };
  }
}
