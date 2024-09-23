'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="min-h-screen flex flex-col justify-between">
        <Header />
        <main className="flex-grow pt-16">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
