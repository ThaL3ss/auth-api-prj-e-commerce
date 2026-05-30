import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { EnderecosController } from './enderecos.controller';
import { EnderecosService } from './enderecos.service';

@Module({
  imports: [PrismaModule],
  controllers: [EnderecosController],
  providers: [EnderecosService],
})
export class EnderecosModule {}
