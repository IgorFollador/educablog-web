'use client';

import { ReactNode, useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Spinner from '@/components/Spinner';
import { jwtDecode } from 'jwt-decode';
import Header from '@/components/Header';

type AdminLayoutProps = {
  children: ReactNode;
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { data: session, status, update } = useSession();

  useEffect(() => {
    if (status === 'loading') return; // Ainda carregando a sessão

    if (!session) {
      signIn();
    } else {
      console.log(session, status);

      // Verificar a expiração do token JWT
      const token = session.user.token;
      const decodedToken = jwtDecode(token) as { exp: number };

      console.log("NOW", Date.now());
      console.log("EXP JWT", decodedToken.exp * 1000);

      if (decodedToken.exp * 1000 < Date.now()) {
        console.log('Token JWT expirou no cliente');
        signOut(); // Desloga o usuário
      } else {
        console.log("Token JWT válido");
      }
    }
  }, [session, status]);

  if (status === 'loading') {
    return <Spinner />
  }

  if (!session) {
    return <p>Redirecionando para a página de login...</p>;
  }

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header isLoggedIn={!!session} />
        <main className="flex-grow pt-16">
          {children}
        </main>
        <Footer />
    </div>
    </>
  );
  
};

export default AdminLayout;
