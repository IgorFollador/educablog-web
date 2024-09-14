'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useParams } from 'next/navigation'; // Para capturar o ID da URL

const EditPostPage = () => {
  const { data: session, status } = useSession();
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [categoriaNome, setCategoriaNome] = useState('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { id } = useParams(); // Captura o ID da URL dinamicamente

  useEffect(() => {
    // Redirecionar para login se não autenticado
    if (status === 'unauthenticated' || !session?.user?.token) {
      router.push('/auth/signin');
    }
  }, [status, session, router]);

  // Carregar dados da postagem ao abrir a página
  useEffect(() => {
    // Verifica se o postId existe e se o token está disponível
    if (id && session?.user?.token) {
      const fetchPostData = async () => {
        try {
          const response = await axios.get(
            `https://apl-back-educablog-1.onrender.com/posts/${id}`,
            {
              headers: {
                Authorization: `Bearer ${session.user.token}`, // Envia o token de autenticação
              },
            }
          );
          
          // Define os valores no estado
          const post = response.data;
          setTitulo(post.titulo);
          setDescricao(post.descricao);
          setImagemUrl(post.imagemUrl);
          setCategoriaId(post.categoria.id);
          setCategoriaNome(post.categoria.nome);
        } catch (err) {
          console.error('Erro ao carregar dados da postagem:', err);
          setError('Erro ao carregar dados da postagem.');
        }
      };

      fetchPostData(); // Chama a função para buscar os dados
    }
  }, [id, session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.put(
        `https://apl-back-educablog-1.onrender.com/posts/${id}`,
        {
          titulo,
          descricao,
          imagemUrl,
          ativo: true,
          categoria: {
            id: categoriaId,
            nome: categoriaNome
          }
        },
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`, // Autenticação com token
          },
        }
      );

      // Redirecionar para a página de listagem após a edição
      router.push('/admin/');
    } catch (err) {
      console.error('Erro ao editar postagem:', err);
      setError('Erro ao editar postagem. Verifique sua conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h1 className="text-3xl font-bold text-center mb-6">Editar Postagem</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Título</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Descrição</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">URL da Imagem (opcional)</label>
          <input
            type="text"
            value={imagemUrl}
            onChange={(e) => setImagemUrl(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">ID da Categoria</label>
          <input
            type="text"
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Nome da Categoria</label>
          <input
            type="text"
            value={categoriaNome}
            onChange={(e) => setCategoriaNome(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  );
};

export default EditPostPage;
