import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { ChangeSenhaDto } from './dto/change-senha.dto';
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
        throw new BadRequestException({ message: 'Dados inválidos' });
      }
    }

    const { senha_hash, refresh_token, ...updated } = await this.prisma.usuario.update({
      where: { id },
      data: dto,
    });

    return updated;
  }

  async changeSenha(id: string, dto: ChangeSenhaDto) {
    const user = await this.prisma.usuario.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado.');

    const senhaValida = await bcrypt.compare(dto.senha_atual, user.senha_hash);
    if (!senhaValida) throw new UnauthorizedException('Senha atual incorreta.');

    const senha_hash = await bcrypt.hash(dto.nova_senha, 10);
    await this.prisma.usuario.update({ where: { id }, data: { senha_hash } });

    return { message: 'Senha alterada com sucesso.' };
  }

  async deleteMe(id: string) {
    await this.prisma.usuario.update({ where: { id }, data: { refresh_token: null } });
    await this.prisma.usuario.delete({ where: { id } });
  }
}
