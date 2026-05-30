import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEnderecoDto } from './dto/create-endereco.dto';
import { UpdateEnderecoDto } from './dto/update-endereco.dto';

@Injectable()
export class EnderecosService {
  constructor(private prisma: PrismaService) {}

  async create(usuarioId: string, dto: CreateEnderecoDto) {
    return this.prisma.endereco.create({
      data: { ...dto, usuario_id: usuarioId },
    });
  }

  async findAll(usuarioId: string) {
    return this.prisma.endereco.findMany({ where: { usuario_id: usuarioId } });
  }

  async update(usuarioId: string, id: number, dto: UpdateEnderecoDto) {
    const endereco = await this.prisma.endereco.findUnique({ where: { id } });
    if (!endereco) throw new NotFoundException('Endereço não encontrado.');
    if (endereco.usuario_id !== usuarioId) throw new ForbiddenException('Acesso negado.');

    return this.prisma.endereco.update({ where: { id }, data: dto });
  }

  async remove(usuarioId: string, id: number) {
    const endereco = await this.prisma.endereco.findUnique({ where: { id } });
    if (!endereco) throw new NotFoundException('Endereço não encontrado.');
    if (endereco.usuario_id !== usuarioId) throw new ForbiddenException('Acesso negado.');

    await this.prisma.endereco.delete({ where: { id } });
  }
}
