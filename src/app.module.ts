import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotesModule } from './notes/notes.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [NotesModule, MongooseModule.forRoot('mongodb://localhost/notes')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
