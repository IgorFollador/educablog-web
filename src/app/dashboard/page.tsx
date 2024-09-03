'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redireciona para a página de login se não estiver autenticado
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <p>Carregando...</p>;
  }

  if (!session) {
    return null; // ou um redirecionamento
  }

  return (
    <div>
      <h1>Bem-vindo à Dashboard, {session.user.name}</h1>
      <button onClick={() => signOut()}>Sair</button>
      {/* Outros conteúdos da dashboard */}
    </div>
  );
};

export default Dashboard;
