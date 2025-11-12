import { ConflictException, Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notes } from './schemas/note.schema';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Notes.name) private noteModel: Model<Notes>) {}

  async create(createNoteDto: CreateNoteDto): Promise<Notes> {
    const { note, content } = createNoteDto;
    const existing = await this.noteModel.findOne({ note });
    if (existing) {
      throw new ConflictException(`Note "${note}" already exists`);
    }

    try {
      const createdNote = new this.noteModel({ note, content });
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

  async update(id: string, updateNoteDto: UpdateNoteDto) {
    const note = await this.noteModel.findByIdAndUpdate(id, updateNoteDto, {
      new: true,
    });
    return note;
  }

  async remove(id: string) {
    const note = await this.noteModel.findByIdAndDelete(id);
    return `Note deleted successfully`;
  }
}
