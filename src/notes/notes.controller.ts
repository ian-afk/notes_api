import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
    const { title, content } = createNoteDto;
    const createdNote = await this.notesService.create({ title, content });
    return {
      message: 'Note created successfully',
      status: 'success',
      data: createdNote,
    };
  }

  @Get()
  async findAll() {
    const notes = await this.notesService.findAll();
    return {
      status: 'success',
      data: notes,
    };
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Invalid ID', 404);
    const findNote = await this.notesService.findOne(id);
    if (!findNote) throw new HttpException('Note ID not found', 404);
    return { status: 'success', data: findNote };
  }

  @Patch('/:id')
  async update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Invalid ID', 404);
    const updateNote = await this.notesService.update(id, updateNoteDto);
    return {
      message: 'Note updated successfully',
      status: 'success',
      data: updateNote,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Invalid ID', 404);
    await this.notesService.remove(id);

    return {
      message: `Note deleted successfully`,
      status: 'success',
    };
  }
}
