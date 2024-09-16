'use client';

import { ReactNode } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { SessionProvider } from 'next-auth/react';
import AdminHome from '@/components/AdminHome';

type AdminLayoutProps = {
  children: ReactNode;
};

const AdminLayout = ({ children }: AdminLayoutProps) => {


  return (
    <>
        <SessionProvider>
            <AuthProvider>
                <AdminHome>
                    { children }
                </AdminHome>
            </AuthProvider>
        </SessionProvider>
    </>
  );
};

export default AdminLayout;
