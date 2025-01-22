import { Configuration } from '@/types';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      useFactory: (config: ConfigService<Configuration>) => {
        return {
          secret: config.get<string>('jwt.secret', { infer: true }) ?? '111',
          signOptions: {
            expiresIn: config.get<string>('jwt.expiresIn', { infer: true }),
          },
        };
      },
      inject: [ConfigService],
    }),
  ], // imports: [JwtModule.register({ secret: '111', signOptions: { expiresIn: '1d' } })],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
