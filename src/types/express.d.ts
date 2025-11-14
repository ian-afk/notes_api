import 'express';

declare module 'express' {
  interface User {
    _id?: string;
    email: string;
    provider: 'local' | 'google';
    password?: string;
    providerId?: string;
    name?: string;
    picture?: string;
  }

  interface Request {
    cookies?: { [key: string]: string };
  }
}
