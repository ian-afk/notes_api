import { IsEmail, IsOptional, IsString, IsEnum } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsEnum(['local', 'google'])
  @IsOptional()
  provider?: 'local' | 'google';

  @IsString()
  @IsOptional()
  providerId?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  picture?: string;
}
