'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import PostList from '../../components/PostList';
import Pagination from '../../components/Pagination';
import ConfirmModal from '../../components/ConfirmModal';
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
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated' || !session?.user.token) {
      router.push('/auth/signin');
    } else {
      fetchPosts(currentPage);
    }
  }, [status, session, router, currentPage]);

  const fetchPosts = async (page: number) => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts/admin`, {
        params: { limite: 10, pagina: page },
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      });

      setPosts(response.data); 

      // TODO: ajustar total de itens
      setTotalPages(Math.ceil((response.data.total || 0) / 10));
    } catch (err) {
      console.error('Erro ao buscar postagens:', err);
      setError('Erro ao buscar postagens. Verifique sua conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

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
            Authorization: `Bearer ${session?.user.token}`,
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

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h1 className="text-3xl font-bold text-center mb-6">Administração de Postagens</h1>
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
          <PostList posts={posts} isAdmin onEdit={handleEdit} onDelete={handleDelete} />
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
