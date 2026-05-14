import { IsEmail, IsString, Length, Matches, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(1)
  nome: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(11, 11)
  @Matches(/^\d{11}$/)
  cpf: string;

  @IsString()
  @MinLength(8)
  senha: string;
}
