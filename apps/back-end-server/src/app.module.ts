import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules';
import configuration from '@/config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
