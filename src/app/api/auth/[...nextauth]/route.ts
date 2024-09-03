import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

// Configuração das opções do NextAuth
const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // Faz a requisição para a API de autenticação
          const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/autenticacao/signin`, {
            login: credentials?.email,
            senha: credentials?.password,
          });

          // Verifica se a resposta contém um token
          if (data.token) {
            return { token: data.token }; // Retorna o token para armazenar na sessão
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
        token.token = user.token; // Armazena o token JWT no token da sessão
      }
      return token;
    },
    async session({ session, token }) {
      session.user = { token: token.token }; // Inclui o token na sessão para uso nas páginas
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin', // Página de login
    error: '/auth/error', // Página de erro (opcional)
  },
  secret: process.env.NEXTAUTH_SECRET, // Chave secreta para o NextAuth
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; // Exporta os métodos GET e POST
