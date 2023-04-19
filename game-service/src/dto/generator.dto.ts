import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GeneratorDto {
  @IsString()
  @IsNotEmpty()
  serverSeed: string;

  @IsString()
  @IsNotEmpty()
  clientSeed: string;

  @IsNumber()
  @IsNotEmpty()
  cursor: number;

  @IsNumber()
  @IsNotEmpty()
  count: number;

  @IsNumber()
  @IsNotEmpty()
  nonce: number;
}
