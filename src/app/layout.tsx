import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientSessionProvider from '../components/ClientSessionProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Educablog Web',
  description: 'Plataforma de postagens para professores e alunos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ClientSessionProvider>
          {children}
        </ClientSessionProvider>
      </body>
    </html>
  );
}
