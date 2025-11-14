import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotesModule } from './notes/notes.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';

import { AuthModule } from './auth/auth.module';
import constants from './auth/constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [constants],
    }),
    NotesModule,
    UsersModule,
    AuthModule,
    MongooseModule.forRoot('mongodb://localhost/notes'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
