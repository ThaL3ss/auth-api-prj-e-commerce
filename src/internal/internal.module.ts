import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InternalController } from './internal.controller';
import { InternalApiKeyGuard } from './internal-api-key.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [InternalController],
  providers: [InternalApiKeyGuard],
})
export class InternalModule {}
