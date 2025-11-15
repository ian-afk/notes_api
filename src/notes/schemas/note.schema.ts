import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { UserDocument } from 'src/types/common';

@Schema()
export class Notes {
  @Prop({ unique: true, required: true })
  title: string;

  @Prop()
  content: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true })
  user: mongoose.Types.ObjectId | UserDocument;
}

export const NotesSchema = SchemaFactory.createForClass(Notes);
