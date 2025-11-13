import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notes } from './schemas/note.schema';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Notes.name) private noteModel: Model<Notes>) {}

  async create(createNoteDto: CreateNoteDto): Promise<Notes> {
    const { title, content } = createNoteDto;
    const existing = await this.noteModel.findOne({ title });
    if (existing) {
      throw new ConflictException(`Note "${title}" already exists`);
    }

    try {
      const createdNote = new this.noteModel({ title, content });
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
