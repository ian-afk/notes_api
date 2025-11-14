import { IsEmail, IsString } from 'class-validator';

export class GoogleLoginDto {
  @IsEmail()
  email: string;

  @IsString()
  providerId: string;

  @IsString()
  name?: string;

  @IsString()
  picture?: string;
}
