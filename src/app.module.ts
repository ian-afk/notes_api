import { Module } from '@nestjs/common';

import { NotesModule } from './notes/notes.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';

import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/notes'),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    NotesModule,
    UsersModule,
    AuthModule,
    SharedModule,
  ],
})
export class AppModule {}
