import { IsEmail, IsString, Length, Matches, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(1)
  nome: string;

  @IsEmail({}, { message: 'Email inválido.' })
  email: string;

  @IsString()
  @Length(11, 11, { message: 'CPF deve ter exatamente 11 dígitos.' })
  @Matches(/^\d{11}$/, { message: 'CPF deve conter apenas dígitos.' })
  cpf: string;

  @IsString()
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres.' })
  senha: string;
}
