import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  HttpException,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import mongoose from 'mongoose';
import { UpdateNoteDto } from './dto/update-note.dto';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  async create(@Body() createNoteDto: CreateNoteDto) {
    const { note, content } = createNoteDto;
    return this.notesService.create({ note, content });
  }

  @Get()
  async findAll() {
    return this.notesService.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Invalid ID', 404);
    const findNote = await this.notesService.findOne(id);
    if (!findNote) throw new HttpException('Note ID not found', 404);
    return findNote;
  }

  @Patch('/:id')
  async update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Invalid ID', 404);
    return this.notesService.update(id, updateNoteDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Invalid ID', 404);
    const deleteNote = await this.notesService.remove(id);
    if (!deleteNote) throw new HttpException('Note not found', 404);
    return this.notesService.remove(id);
  }
}
