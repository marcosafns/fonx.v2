import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userService.createUser({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    });

    const { password, ...result } = user;
    return result;
  }



  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email); // <-- ESSENCIAL

    console.log('Email:', email);
    console.log('Senha recebida:', password);

    if (!user) {
      console.log('Usuário não encontrado!');
      throw new UnauthorizedException('Usuário não encontrado');
    }

    console.log('Senha do banco:', user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Senha bateu?', isMatch);

    if (!isMatch) {
      throw new UnauthorizedException('Senha incorreta');
    }

    const { password: _, ...rest } = user;
    return rest;
  }



  async login(user: any) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
