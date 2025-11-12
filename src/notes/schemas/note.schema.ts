import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Notes {
  @Prop({ unique: true, required: true })
  note: string;

  @Prop()
  content: string;
}

export const NotesSchema = SchemaFactory.createForClass(Notes);
