import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateEnderecoDto } from './dto/create-endereco.dto';
import { UpdateEnderecoDto } from './dto/update-endereco.dto';
import { EnderecosService } from './enderecos.service';

@UseGuards(JwtAuthGuard)
@Controller('enderecos')
export class EnderecosController {
  constructor(private enderecosService: EnderecosService) {}

  @Post()
  async create(@Req() req: any, @Body() dto: CreateEnderecoDto) {
    return this.enderecosService.create(req.user.sub, dto);
  }

  @Get()
  async findAll(@Req() req: any) {
    return this.enderecosService.findAll(req.user.sub);
  }

  @Put(':id')
  async update(@Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEnderecoDto) {
    return this.enderecosService.update(req.user.sub, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    await this.enderecosService.remove(req.user.sub, id);
  }
}
