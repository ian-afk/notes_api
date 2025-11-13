import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotesModule } from './notes/notes.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
// import { UsersModule } from './users/users.module';
// import { GoogleStrategy } from './google.strategy';

@Module({
  imports: [
    NotesModule,
    UsersModule,
    MongooseModule.forRoot('mongodb://localhost/notes'),
    ConfigModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
