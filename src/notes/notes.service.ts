import {
  ConflictException,
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { Notes } from './schemas/note.schema';
import { Users } from 'src/users/schemas/users.schema';
import { User } from 'express';
import { UserDocument } from 'src/types/common';

type NoteDocument = Notes & Document;

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Notes.name) private noteModel: Model<NoteDocument>,
    @InjectModel(Users.name) private userModel: Model<UserDocument>,
  ) {}

  async create(
    { title, content }: CreateNoteDto,
    user: string,
  ): Promise<Notes> {
    const existing = await this.noteModel.findOne({ title });
    const userId = await this.userModel.findById(user);
    if (!userId) throw new NotFoundException('User not found');
    if (existing) {
      throw new ConflictException(`Note "${title}" already exists`);
    }

    try {
      const createdNote = new this.noteModel({ title, content, user });
      return await createdNote.save();
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(user: string): Promise<Notes[]> {
    return await this.noteModel.find({ user }).exec();
  }

  async findOne(id: string, user: string) {
    return await this.noteModel.find({ _id: id, user });
  }

  async update(
    { id, user }: { id: string; user: User },
    updateNoteDto: UpdateNoteDto,
  ): Promise<Notes> {
    const findNote = await this.noteModel.findById(id).populate('user');

    if (!findNote) {
      throw new NotFoundException('Note not found');
    }

    const noteUserId = findNote.user._id.toString();

    if (noteUserId !== user._id) {
      throw new ForbiddenException('You can not edit this note');
    }

    if (updateNoteDto.title) {
      if (findNote.title.toLowerCase() === updateNoteDto.title.toLowerCase())
        throw new HttpException('Note Title already exist', 409);
    }

    const note = (await this.noteModel.findByIdAndUpdate(id, updateNoteDto, {
      new: true,
    })) as Notes;
    return note;
  }

  async remove(id: string, user: User) {
    const findNote = await this.noteModel.findById(id).populate('user');

    if (!findNote) {
      throw new NotFoundException('Note not found');
    }

    const noteUserId = findNote.user._id.toString();

    if (noteUserId !== user._id) {
      throw new ForbiddenException('You can not delete this note');
    }

    await this.noteModel.deleteOne({ _id: id });
  }
}
