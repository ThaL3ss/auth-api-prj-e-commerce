import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async findMe(id: string) {
    const user = await this.prisma.usuario.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado.');

    const { senha_hash, refresh_token, ...result } = user;
    return result;
  }

  async updateMe(id: string, dto: UpdateUsuarioDto) {
    if (dto.email) {
      const existing = await this.prisma.usuario.findUnique({
        where: { email: dto.email },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('Email já está em uso por outro usuário.');
      }
    }

    const { senha_hash, refresh_token, ...updated } = await this.prisma.usuario.update({
      where: { id },
      data: dto,
    });

    return updated;
  }

  async deleteMe(id: string) {
    await this.prisma.usuario.update({ where: { id }, data: { refresh_token: null } });
    await this.prisma.usuario.delete({ where: { id } });
  }
}
