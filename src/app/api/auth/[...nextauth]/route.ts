import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/autenticacao/signin`, {
            login: credentials?.email,
            senha: credentials?.password,
          });

          if (data.token) {
            const decodedToken = jwtDecode(data.token);
            const exp = decodedToken.exp || 0;

            return {
              id: "91590074-69f6-45c0-8421-25a6f14be99e",
              token: data.token,
              exp,
              name: credentials?.email,
              email: credentials?.email,
            };
          }
          return null;
        } catch (error) {
          console.error('Erro de autenticação:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.token = user.token as string;
        token.exp = user.exp;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = { ...session.user, token: token.token as string };

      if (token.exp) {
        session.expires = new Date(token.exp as number * 1000).toISOString();
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
