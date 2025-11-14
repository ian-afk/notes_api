import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Users {
  @Prop({ unique: true, required: true })
  email: string;

  @Prop()
  password?: string;

  @Prop({ default: 'local' })
  provider: 'local' | 'google';

  @Prop()
  providerId?: string;

  @Prop()
  name?: string;

  @Prop()
  picture?: string;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
