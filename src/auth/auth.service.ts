import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const [emailExists, cpfExists] = await Promise.all([
      this.prisma.usuario.findUnique({ where: { email: dto.email } }),
      this.prisma.usuario.findUnique({ where: { cpf: dto.cpf } }),
    ]);

    if (emailExists) throw new ConflictException('Email já cadastrado.');
    if (cpfExists) throw new ConflictException('CPF já cadastrado.');

    const senha_hash = await bcrypt.hash(dto.senha, 10);

    const { senha_hash: _omit, refresh_token: _rt, ...usuario } = await this.prisma.usuario.create({
      data: { nome: dto.nome, email: dto.email, cpf: dto.cpf, senha_hash },
    });

    return usuario;
  }

  async validateUser(email: string, senha: string) {
    const user = await this.prisma.usuario.findUnique({ where: { email } });
    if (!user) return null;

    const valid = await bcrypt.compare(senha, user.senha_hash);
    if (!valid) return null;

    const { senha_hash, ...result } = user;
    return result;
  }

  async login(user: Record<string, any>) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
    });

    await this.prisma.usuario.update({
      where: { id: user.id },
      data: { refresh_token: refreshToken },
    });

    return { accessToken, refreshToken };
  }

  async refreshToken(token: string) {
    const user = await this.prisma.usuario.findFirst({
      where: { refresh_token: token },
    });

    if (!user) throw new UnauthorizedException();

    try {
      this.jwtService.verify(token, { secret: process.env.JWT_REFRESH_SECRET });
    } catch {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
    });

    await this.prisma.usuario.update({
      where: { id: user.id },
      data: { refresh_token: refreshToken },
    });

    return { accessToken, refreshToken };
  }
}
