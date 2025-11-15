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
import mongoose, { Document, Error, Model } from 'mongoose';
import { Notes } from './schemas/note.schema';
import { Users } from 'src/users/schemas/users.schema';
import { Request, User } from 'express';
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
      const newError = error as Error;
      throw new Error(newError.message);
    }
  }

  async findAll(req: Request): Promise<Notes[]> {
    const user = req.user as User;
    if (!user || !user._id) {
      throw new HttpException('Unauthorized', 401);
    }

    return await this.noteModel.find({ user }).exec();
  }

  async findOne(id: string, req: Request) {
    const reqUser = req.user as User;
    if (!reqUser || !reqUser._id) {
      throw new HttpException('Unauthorized', 401);
    }
    const isValid = mongoose.Types.ObjectId.isValid(id);

    if (!isValid) throw new HttpException('Invalid ID', 404);

    const notes = await this.noteModel.find({ _id: id, user: reqUser._id });

    if (!notes) throw new HttpException('Note ID not found', 404);
    return notes;
  }

  async update(
    id: string,
    req: Request,
    updateNoteDto: UpdateNoteDto,
  ): Promise<Notes> {
    const reqUser = req.user as User;

    if (!reqUser || !reqUser._id) {
      throw new HttpException('Unauthorized', 401);
    }

    const isValid = mongoose.Types.ObjectId.isValid(id);

    if (!isValid) throw new HttpException('Invalid ID', 404);

    const findNote = await this.noteModel.findById(id).populate('user');

    if (!findNote) {
      throw new NotFoundException('Note not found');
    }

    const noteUserId = findNote.user._id.toString();

    if (noteUserId !== reqUser._id) {
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

  async remove(id: string, req: Request) {
    const reqUser = req.user as User;

    if (!reqUser || !reqUser._id) {
      throw new HttpException('Unauthorized', 401);
    }

    const isValid = mongoose.Types.ObjectId.isValid(id);

    if (!isValid) throw new HttpException('Invalid ID', 404);

    const findNote = await this.noteModel.findById(id).populate('user');

    if (!findNote) {
      throw new NotFoundException('Note not found');
    }

    const noteUserId = findNote.user._id.toString();

    if (noteUserId !== reqUser._id) {
      throw new ForbiddenException('You can not delete this note');
    }

    await this.noteModel.deleteOne({ _id: id });
  }
}
