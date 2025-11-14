import {
  // BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

import bcrypt from 'node_modules/bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from 'src/users/schemas/users.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Users.name) private userModel: Model<Users>,
    private jwtService: JwtService,
  ) {}

  signToken = (id: string, email: string) => {
    const payload = { sub: id, email };
    return this.jwtService.signAsync(payload);
  };

  async signIn(email: string, password: string): Promise<{ token: string }> {
    const user = await this.userModel.findOne({ email }).select('+password');

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password!);
    if (!isPasswordCorrect)
      throw new UnauthorizedException('Invalid email or password');

    const token = await this.signToken(user._id.toString(), user.email);

    return {
      token,
    };
  }

  async singUp(email: string, password: string): Promise<{ token: string }> {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new this.userModel({ email, password: hashedPassword });

    const token = await this.signToken(user._id.toString(), user.email);

    return {
      token,
    };
  }

  async signInGoogle(googleUser: Users) {
    if (!googleUser.providerId) {
      throw new Error('providerId is required');
    }

    const userExists = await this.findUserByEmail(googleUser.email);

    if (!userExists) {
      return this.signUpGoogle({ ...googleUser, provider: 'google' });
    }

    return this.signToken(userExists._id.toString(), userExists.email);
  }

  async signUpGoogle(user: CreateUserDto) {
    try {
      const newUser = await this.userModel.create(user);

      return this.signToken(newUser._id.toString(), newUser.email);
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException();
    }
  }

  async findUserByEmail(email: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      return null;
    }

    return user;
  }
}
