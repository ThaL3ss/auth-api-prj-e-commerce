import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUsuarioDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  nome?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
