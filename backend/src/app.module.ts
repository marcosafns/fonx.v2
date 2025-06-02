import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CartModule } from './cart/cart.module';
import { CheckoutModule } from './checkout/checkout.module';

@Module({
  imports: [AuthModule, UserModule, CartModule, CheckoutModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
