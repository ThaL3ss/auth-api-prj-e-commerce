import { IsInt, IsOptional, IsString, Length, MaxLength, Min } from 'class-validator';

export class UpdateEnderecoDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  nome?: string;

  @IsOptional()
  @IsString()
  @Length(8, 8)
  cep?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  rua?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  numero?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  complemento?: string;
}
