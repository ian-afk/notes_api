import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from 'src/users/schemas/users.schema';

import { ConfigModule } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from 'src/strategies/google.strategy';
import { NotesModule } from 'src/notes/notes.module';
import { SharedModule } from 'src/shared/shared.module';
import { JwtStrategy } from 'src/strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ session: false }),
    UsersModule,
    ConfigModule,
    SharedModule,
    forwardRef(() => NotesModule),
    MongooseModule.forFeature([
      {
        name: Users.name,
        schema: UsersSchema,
      },
    ]),
  ],
  providers: [AuthService, UsersService, GoogleStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
