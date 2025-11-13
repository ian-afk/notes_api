import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Users } from 'src/users/schemas/users.schema';

@Schema()
export class Notes {
  @Prop({ unique: true, required: true })
  title: string;

  @Prop()
  content: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true })
  user: Users;
}

export const NotesSchema = SchemaFactory.createForClass(Notes);
