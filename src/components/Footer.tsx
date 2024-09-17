import Link from 'next/link';
import { FaGithub, FaArrowCircleUp, FaMailBulk } from 'react-icons/fa';
import Image from 'next/image';
import ScrollToTopButton from './ScrollToTopButton';

const Footer = () => {
  return (
    <>
    <ScrollToTopButton />
      <footer className="bg-sky-950 text-white py-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          {/* Logo no canto esquerdo */}
          <div className="text-white text-2xl flex items-center mb-4 md:mb-0">
            <Link href="/">
              <div className="flex items-center">
                <Image
                  src="/logo.png"
                  width={20} // Ajuste o tamanho conforme necessário
                  height={20} // Ajuste o tamanho conforme necessário
                  className="mr-2"
                  alt="Logo"
                />
                <span>EducaBlog</span>
              </div>
            </Link>
          </div>

          {/* Ícones */}
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <a 
              href="https://github.com/IgorFollador/educablog-web" 
              target="_blank" 
              className="hover:text-yellow-500"
            >
              <FaGithub className="w-6 h-6 md:w-7 md:h-7" />
            </a>
            <a 
              href="mailto:fiap_grupo26@outlook.com" 
              className="hover:text-yellow-500"
            >
              <FaMailBulk className="w-6 h-6 md:w-7 md:h-7" />
            </a>
          </div>
        </div>

        {/* Copyright centralizado */}
        <div className="text-center text-white mt-4">
          <p>&copy; {new Date().getFullYear()} EducaBlog. Todos os direitos reservados.</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
