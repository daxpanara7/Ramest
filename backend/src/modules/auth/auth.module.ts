import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';
import { RecaptchaService } from '../../common/recaptcha/recaptcha.service';

@Module({
  imports: [JwtModule.register({})], // secrets passed per-call from config
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, PasswordService, TokenService, RecaptchaService],
  exports: [PasswordService], // reused by the users module (create/reset password)
})
export class AuthModule {}
