import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    return this.usersService.create({ email, password });
  }

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return {
      status: 'success',
      data: users,
    };
  }
}
