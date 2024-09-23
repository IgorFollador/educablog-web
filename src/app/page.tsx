'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Home from '../components/Home';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Home />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
