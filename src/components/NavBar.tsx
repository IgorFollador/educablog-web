import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    router.push('/auth/signin');
  };

  const handleLogout = () => {
    router.push('/');
  };

  return (
      <nav className="bg-blue-950 fixed top-0 left-0 w-full z-100 shadow-black">
        <div className="container mx-auto flex justify-between items-center">
          
          {/* Logo centralizado em telas pequenas e alinhado à esquerda em telas grandes */}
          <div className="md:flex-1 md:justify-start flex justify-center p-5">
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

          {/* Botão de menu sanduíche visível apenas em telas pequenas (à direita) */}
          <div className="md:hidden">
            <button
              className="text-white p-2 focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              <svg
                className={`w-8 h-8 transform transition-transform ${isOpen ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>

          {/* Menu de login/logout visível em telas maiores */}
          <div className="hidden md:flex space-x-4">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="text-white hover:bg-yellow-500 p-6"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="text-white hover:bg-yellow-500 p-6"
              >
                Login
              </button>
            )}
          </div>
        </div>

        {/* Menu de login/logout visível em telas pequenas quando o botão de menu é ativado */}
        {isOpen && (
          <div className="absolute left-0 w-full bg-sky-900 z-10 top-full">
            <div className="flex flex-col items-center w-full">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="text-white px-4 py-2 w-full text-center"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={handleLogin}
                  className="text-white px-4 py-2 w-full text-center"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
  );
};

export default Navbar;
