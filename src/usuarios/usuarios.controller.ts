import { Body, Controller, Delete, Get, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuariosService } from './usuarios.service';

@UseGuards(JwtAuthGuard)
@Controller('usuarios')
export class UsuariosController {
  constructor(private usuariosService: UsuariosService) {}

  @Get('me')
  async me(@Req() req: any) {
    return this.usuariosService.findMe(req.user.sub);
  }

  @Put('me')
  async update(@Req() req: any, @Body() dto: UpdateUsuarioDto) {
    return this.usuariosService.updateMe(req.user.sub, dto);
  }

  @Delete('me')
  async delete(@Req() req: any) {
    await this.usuariosService.deleteMe(req.user.sub);
    return { message: 'Conta removida com sucesso.' };
  }
}
