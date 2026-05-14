import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { InternalApiKeyGuard } from './internal-api-key.guard';

@UseGuards(InternalApiKeyGuard)
@Controller('internal')
export class InternalController {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  @Post('auth/validate-token')
  @HttpCode(HttpStatus.OK)
  async validateToken(@Body('token') token: string) {
    try {
      const payload = this.jwtService.verify<{ sub: string; role: string }>(token);
      return { valid: true, userId: payload.sub, role: payload.role };
    } catch {
      throw new HttpException({ valid: false }, HttpStatus.UNAUTHORIZED);
    }
  }

  @Get('usuarios/:id')
  async getUsuario(@Param('id') id: string) {
    const user = await this.prisma.usuario.findUnique({ where: { id } });

    if (!user) {
      throw new HttpException(
        { error: 'Usuário não encontrado' },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role,
      data_criacao: user.data_criacao,
    };
  }
}
