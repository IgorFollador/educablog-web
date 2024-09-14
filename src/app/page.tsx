'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import PostList from '../components/PostList';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    fetchPosts(); // Carregar posts iniciais
  }, [currentPage]);

  const fetchPosts = async (query = '') => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      setError('A URL da API não está definida corretamente. Verifique as variáveis de ambiente.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = query
        ? await axios.get(`${apiUrl}/posts/search`, {
            params: { query, limite: 10, pagina: currentPage },
          })
        : await axios.get(`${apiUrl}/posts`, {
            params: {
              limite: 10,
              pagina: currentPage,
            },
          });

      console.log('Dados recebidos:', response.data);
      setPosts(response.data);
      setTotalPages(Math.ceil(response.headers['x-total-count'] / 10)); // Ajustar na API para retornar estes dados
      setError('');
    } catch (err) {
      console.error('Erro ao buscar posts:', err);

      if (axios.isAxiosError(err)) {
        if (err.response) {
          setError(`Erro: ${err.response.status} - ${err.response.statusText}`);
        } else if (err.request) {
          setError('Não foi possível obter resposta da API. Verifique a conectividade e as configurações de rede.');
        } else {
          setError(`Erro ao configurar a requisição: ${err.message}`);
        }
      } else {
        setError('Ocorreu um erro inesperado.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Resetar para a primeira página ao fazer uma nova busca
    fetchPosts(query);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <NavBar/>
      <div className="max-w-3xl mx-auto m-10 p-4 pt-16">
        <h1 className="text-3xl font-bold text-center mb-6">EducaBlog - Gestão de postagens escolares</h1>
        <SearchBar onSearch={handleSearch} />

        {loading && <p className="text-center mt-4">Carregando posts...</p>}
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}
        
        <PostList posts={posts} />
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
      <Footer/>
    </div>
  );
};

export default Home;
