import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notes } from './schemas/note.schema';
import { Users } from 'src/users/schemas/users.schema';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Notes.name) private noteModel: Model<Notes>,
    @InjectModel(Users.name) private userModel: Model<Users>,
  ) {}

  async create(createNoteDto: CreateNoteDto): Promise<Notes> {
    const { title, content, user } = createNoteDto;
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

  async findAll(): Promise<Notes[]> {
    return await this.noteModel.find().exec();
  }

  async findOne(id: string) {
    return await this.noteModel.findById(id);
  }

  async update(id: string, updateNoteDto: UpdateNoteDto): Promise<Notes> {
    const note = await this.noteModel.findByIdAndUpdate(id, updateNoteDto, {
      new: true,
    });
    if (!note) throw new HttpException('Note not found', 404);
    return note;
  }

  async remove(id: string) {
    const exists = await this.noteModel.findByIdAndDelete(id);
    if (!exists) throw new HttpException('Note not found', 404);
  }
}
