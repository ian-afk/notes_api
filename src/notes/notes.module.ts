import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Notes, NotesSchema } from './schemas/note.schema';
import { Users, UsersSchema } from 'src/users/schemas/users.schema';

import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    SharedModule,
    MongooseModule.forFeature([
      { name: Notes.name, schema: NotesSchema },
      {
        name: Users.name,
        schema: UsersSchema,
      },
    ]),
  ],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
