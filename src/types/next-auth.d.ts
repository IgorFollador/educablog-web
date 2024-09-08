import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    token: string;
    exp: number;
  }

  interface Session {
    user: User;
  }
}
