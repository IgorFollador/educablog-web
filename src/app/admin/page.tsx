'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import PostList from '../../components/PostList';
import Pagination from '../../components/Pagination';
import ConfirmModal from '../../components/ConfirmModal';
import SearchBar from '../../components/SearchBar';
import axios from 'axios';

type Post = {
  id: string;
  titulo: string;
  descricao: string;
  imagemUrl?: string;
  ativo: boolean;
  dataCriacao: string;
  dataAtualizacao: string;
  categoria?: {
    id: string;
    nome: string;
  };
};

const AdminPage = () => {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const router = useRouter();

  const fetchPosts = useCallback(async (page: number, query: string = '') => {
    setLoading(true);
    setError('');

    const postsLimit = process.env.NEXT_PUBLIC_POSTS_LIMIT || '10';

    try {
      const response = query
        ? await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts/admin/search`, {
            params: { query, limite: parseInt(postsLimit, 10), pagina: page },
            headers: {
              Authorization: `Bearer ${session?.user?.token}`,
            },
          })
        : await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts/admin`, {
            params: { limite: parseInt(postsLimit, 10), pagina: page },
            headers: {
              Authorization: `Bearer ${session?.user?.token}`,
            },
          });
  
      setPosts(response.data);
      setTotalPages(Math.ceil(response.headers['x-total-count'] / parseInt(postsLimit, 10)));
    } catch (err) {
        console.error('Erro ao buscar posts:', err);
        
        if (axios.isAxiosError(err)) {
            if (err.response) {
                if (err.response.status === 404) {
                    setPosts([]);
                    setTotalPages(0);
                } else {
                    setError(`Erro: ${err.response.status} - ${err.response.statusText}`);
                }
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
  }, [session?.user?.token]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.token) {
      fetchPosts(currentPage, searchQuery);
    }
  }, [session, status, currentPage, searchQuery, fetchPosts]);

  const handleEdit = (postId: string) => {
    router.push(`/admin/edit/${postId}`);
  };

  const handleDelete = (postId: string) => {
    setSelectedPostId(postId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (selectedPostId) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/posts/${selectedPostId}`, {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`,
          },
        });

        setPosts(posts.filter((post) => post.id !== selectedPostId));
        setShowModal(false);
      } catch (err) {
        console.error('Erro ao deletar postagem:', err);
        setError('Erro ao deletar postagem. Verifique sua conexão e tente novamente.');
      }
    }
  };

  const handleSearch = (query: string) => {
    setCurrentPage(1);
    setSearchQuery(query);
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h1 className="text-3xl font-bold text-center mb-6">Administração de Postagens</h1>
      
      <SearchBar onSearch={handleSearch} />

      <div className="flex justify-end mb-4">
        <Link href="/admin/create" className="py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700">
          Criar Nova Postagem
        </Link>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {loading ? (
        <p className="text-center">Carregando postagens...</p>
      ) : (
        <>
          <PostList posts={posts} isLoading={loading} isAdmin onEdit={handleEdit} onDelete={handleDelete} />
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      )}

      {showModal && (
        <ConfirmModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={confirmDelete}
          title="Confirmar Deleção"
          message="Tem certeza que deseja deletar esta postagem?"
        />
      )}
    </div>
  );
};

export default AdminPage;
