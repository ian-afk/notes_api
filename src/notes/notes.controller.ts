import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';

import { UpdateNoteDto } from './dto/update-note.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import type { Request, User } from 'express';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Req() req: Request, @Body() createNoteDto: CreateNoteDto) {
    const user = req.user as User;
    if (!user || !user._id) {
      throw new HttpException('Unauthorized', 401);
    }
    const { title, content } = createNoteDto;

    const createdNote = await this.notesService.create(
      {
        title,
        content,
      },
      user._id.toString(),
    );
    return {
      message: 'Note created successfully',
      status: 'success',
      data: createdNote,
    };
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Req() req: Request) {
    const notes = await this.notesService.findAll(req);

    return {
      status: 'success',
      data: notes,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    const findNote = await this.notesService.findOne(id, req);

    return { status: 'success', data: findNote };
  }

  @UseGuards(AuthGuard)
  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @Req() req: Request,
  ) {
    const updateNote = await this.notesService.update(id, req, updateNoteDto);

    return {
      message: 'Note updated successfully',
      status: 'success',
      data: updateNote,
    };
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    await this.notesService.remove(id, req);

    return {
      message: `Note deleted successfully`,
      status: 'success',
    };
  }
}
