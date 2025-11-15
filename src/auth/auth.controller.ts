import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { GoogleOauthGuard } from './google-oauth.guard';
import type { Request, Response, User } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginUserDto) {
    const { email, password } = loginDto;
    return this.authService.signIn(email, password);
  }

  @Post('signup')
  async signup(@Body() loginDto: LoginUserDto) {
    const { email, password } = loginDto;
    return this.authService.singUp(email, password);
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async auth() {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    try {
      const user = req.user as User;
      const token = await this.authService.signInGoogle(user);

      console.log(user);

      res.cookie('access_token', token, {
        maxAge: 2592000000, // 30 days
        httpOnly: true,
        secure: false,
      });

      res
        .status(HttpStatus.OK)
        .json({ message: 'Authentication successful!', token });
      console.log('im here and its success auth controller');
    } catch (error) {
      console.log('nandito lang ako auth controller');

      console.error('Error during Google auth callback:', error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Authentication failed', error });
    }
  }
}
