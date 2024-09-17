'use client';

import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
// import { createSession } from '@/lib/session';

const SignInPage = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email, // Passe os campos de credenciais corretamente
        password,
        callbackUrl: '/admin', // URL para redirecionar após login bem-sucedido
      });

      console.log(result);

      setLoading(false);

      if (result?.error) {
        setError('Login ou senha inválidos. Tente novamente.');
      } else {
        // await createSession(result.user.id)
        // Redirecionar para /admin após login bem-sucedido
        router.push('/admin');
      }
    } catch (err) {
      setError('Erro ao tentar autenticar. Por favor, tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-lg">
        <div className="flex justify-center p-5 bg-blue-950">
          <Link href="/">
            <div className="flex items-center">
              <Image
                src="/logo.png"
                width={20}
                height={20}
                className='mr-1'
                alt="Logo"
              />
              <span className="text-white text-2xl">EducaBlog</span>
            </div>
          </Link>
        </div>
        <h2 className="text-2xl font-bold text-center">Painel Administrativo</h2>
        <small className="block text-center text-gray-500">Insira suas credenciais para acessar</small>
        {error && <p className="text-center text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
