import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaClient } from '../../generated/prisma';
import { Param, Delete } from '@nestjs/common';
import { Patch } from '@nestjs/common';

const prisma = new PrismaClient();

@Controller('cart')
export class CartController {
  @UseGuards(JwtAuthGuard)
  @Post('add')
  async addToCart(@Body() body, @Req() req) {
    const userId = req.user.id;

    const newItem = await prisma.cart_items.create({
      data: {
        user_id: userId,
        product_name: body.product_name,
        product_img: body.product_img,
        price: body.price,
        quantity: body.quantity || 1,
        size: body.size,
      },
    });

    return { message: 'Item adicionado ao carrinho!', item: newItem };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getCart(@Req() req) {
    const userId = req.user.id;

    const items = await prisma.cart_items.findMany({
      where: { user_id: userId },
    });

    return {
      message: 'Carrinho carregado!',
      items,
    };
  }
  @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async removeItem(@Param('id') id: string, @Req() req) {
    const userId = req.user.id;

    const item = await prisma.cart_items.findUnique({
        where: { id: Number(id) },
    });

    if (!item || item.user_id !== userId) {
        return { message: 'Item não encontrado ou não pertence ao usuário.' };
    }

    await prisma.cart_items.delete({
        where: { id: Number(id) },
    });

    return { message: 'Item removido do carrinho!' };
    }

    @UseGuards(JwtAuthGuard)
@Patch(':id')
async updateItem(@Param('id') id: string, @Body() body, @Req() req) {
  const userId = req.user.id;

  const item = await prisma.cart_items.findUnique({
    where: { id: Number(id) },
  });

  if (!item || item.user_id !== userId) {
    return { message: 'Item não encontrado ou não pertence ao usuário.' };
  }

  const updatedItem = await prisma.cart_items.update({
    where: { id: Number(id) },
    data: {
      quantity: body.quantity ?? item.quantity,
      size: body.size ?? item.size,
    },
  });

  return {
    message: 'Item atualizado!',
    item: updatedItem,
  };
}
}
