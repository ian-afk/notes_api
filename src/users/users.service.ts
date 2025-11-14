import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './schemas/users.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import bcrypt from 'node_modules/bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(Users.name) private userModel: Model<Users>) {}

  async create(createUserDto: CreateUserDto): Promise<Users> {
    const { email, password } = createUserDto;

    const hashedPassword = await bcrypt.hash(password!, 12);

    const existing = await this.userModel.findOne({ email });
    if (existing) {
      throw new ConflictException(`Email ${email} already existing`);
    }

    try {
      const createdUser = new this.userModel({
        email,
        password: hashedPassword,
      });
      return await createdUser.save();
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });
    return user;
  }

  async findAll() {
    return await this.userModel.find({});
  }
  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }
  async findByGoogleId(providerId: string) {
    return this.userModel.findOne({ providerId });
  }
}
