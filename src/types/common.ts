import { HydratedDocument } from 'mongoose';
import { Users } from 'src/users/schemas/users.schema';

export type UserDocument = HydratedDocument<Users>;
