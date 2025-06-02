import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

@Injectable()
export class UserService {
  async findByEmail(email: string) {
    return prisma.users.findUnique({ where: { email } });
  }
  async createUser(data: { name: string; email: string; password: string }) {
    return prisma.users.create({
      data, // ← já vem hasheada do auth.service
    });
  }
}
