import { Test, TestingModule } from '@nestjs/testing';
import { NotesService } from './notes.service';
import { getModelToken } from '@nestjs/mongoose';
import { Notes } from './schemas/note.schema';
import mongoose, { Model } from 'mongoose';
import { Users } from '../users/schemas/users.schema';

describe('NotesService', () => {
  let noteService: NotesService;
  let model: Model<Notes>;
  const mockUsers: {
    _id: string;
    email: string;
    provider: 'local' | 'google';
  } = {
    _id: '69159bcc59e34d8daf4e6dc5',
    email: 'test@email.com',
    provider: 'local',
  };

  const mockNotes = {
    _id: '6917608e29cb9f077055045e',
    title: 'logged 2',
    content: 'logged in successfully from google',
    user: '69159bcc59e34d8daf4e6dc5',
  };

  const mockNotesArray = [
    {
      _id: '6917608e29cb9f077055045e',
      title: 'logged 2',
      content: 'logged in successfully from google',
      user: '69159bcc59e34d8daf4e6dc5',
    },
    {
      _id: '6917608e29cb9f077055045e',
      title: 'logged 2',
      content: 'logged in successfully from google',
      user: '69159bcc59e34d8daf4e6dc5',
    },
    {
      _id: '6917608e29cb9f077055045e',
      title: 'logged 2',
      content: 'logged in successfully from google',
      user: '69159bcc59e34d8daf4e6dc5',
    },
    {
      _id: '6917608e29cb9f077055045e',
      title: 'logged 2',
      content: 'logged in successfully from google',
      user: '69159bcc59e34d8daf4e6dc5',
    },
    {
      _id: '6917608e29cb9f077055045e',
      title: 'logged 2',
      content: 'logged in successfully from google',
      user: '69159bcc59e34d8daf4e6dc5',
    },
    {
      _id: '6917608e29cb9f077055045e',
      title: 'logged 2',
      content: 'logged in successfully from google',
      user: '69159bcc59e34d8daf4e6dc5',
    },
    {
      _id: '6917608e29cb9f077055045e',
      title: 'logged 2',
      content: 'logged in successfully from google',
      user: '69159bcc59e34d8daf4e6dc5',
    },
    {
      _id: '6917608e29cb9f077055045e',
      title: 'logged 2',
      content: 'logged in successfully from google',
      user: '69159bcc59e34d8daf4e6dc5',
    },
  ];

  const mockNoteModel = {
    find: jest.fn().mockImplementation((query) => {
      const match =
        String(query._id) === mockNotes._id &&
        String(query.user) === mockNotes.user;
      return { exec: jest.fn().mockResolvedValue(match ? [mockNotes] : []) };
    }),
    findOne: jest.fn().mockImplementation((query) => {
      const match =
        String(query._id) === mockNotes._id &&
        String(query.user) === mockNotes.user;
      return {
        exec: jest.fn().mockResolvedValue(match ? mockNotes : null),
      };
    }),
    findById: jest.fn().mockImplementation((query) => {
      // Only return note if both _id and user match
      const match =
        String(query._id) === mockNotes._id &&
        String(query.user) === mockUsers._id;
      return {
        exec: jest.fn().mockResolvedValue(match ? [mockNotes] : []),
      };
    }),
    create: jest.fn(),
  };

  const mockUserModel = {
    findById: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: getModelToken(Notes.name),
          useValue: mockNoteModel,
        },
        {
          provide: getModelToken(Users.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    noteService = module.get<NotesService>(NotesService);
    model = module.get<Model<Notes>>(getModelToken(Notes.name));
  });

  describe('findOne', () => {
    it('should return note by id', async () => {
      const result = await noteService.findOne(mockNotes._id, mockUsers);
      const ObjectId = mongoose.Types.ObjectId;
      expect(model.findOne).toHaveBeenCalledWith({
        _id: new ObjectId(mockNotes._id),
        user: new ObjectId(mockUsers._id),
      });
      expect(result).toEqual(mockNotes);
    });

    it('should send note not found', async () => {
      const ObjectId = mongoose.Types.ObjectId;

      await expect(
        noteService.findOne('000000000000000000000000', mockUsers),
      ).rejects.toThrow('Note ID not found');
    });
  });

  // describe('findAll', () => {
  //   it('should return all note', async () => {
  //     const result = await noteService.findAll(mockUsers);
  //     const ObjectId = mongoose.Types.ObjectId;

  //     expect(Array.isArray(result)).toBe(true);
  //     expect(result).toEqual([mockNotesArray]);
  //   });
  // });
});
