import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        login: { label: "Login", type: "text" },
        senha: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Usando a variável de ambiente para a URL da API
          const res = await axios.post(`${process.env.API_URL}/autenticacao/signin`, {
            login: credentials?.login,
            senha: credentials?.senha,
          });

          const user = res.data;

          // Se o token for retornado com sucesso
          if (user.token) {
            return {
              id: user.id, // Defina os campos que desejar passar para a sessão
              token: user.token,
            };
          }

          // Retornar null caso a autenticação falhe
          return null;
        } catch (error) {
          console.error("Erro ao autenticar:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
      // Adicione o token JWT ao token do NextAuth
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
      }
      return token;
    },
    // Inclua o token na sessão para uso no lado do cliente
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin', // Página de login personalizada
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
