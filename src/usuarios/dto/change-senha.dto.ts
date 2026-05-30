import { IsString, MinLength } from 'class-validator';

export class ChangeSenhaDto {
  @IsString()
  senha_atual: string;

  @IsString()
  @MinLength(8)
  nova_senha: string;
}
