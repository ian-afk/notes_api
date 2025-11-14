import { Injectable, UnauthorizedException } from '@nestjs/common';

import bcrypt from 'node_modules/bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from 'src/users/schemas/users.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

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

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
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
}
