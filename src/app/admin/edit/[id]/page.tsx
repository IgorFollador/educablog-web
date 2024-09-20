'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useParams } from 'next/navigation';

const EditPostPage = () => {
  const { data: session, status } = useSession();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (status === 'unauthenticated' || !session?.user?.token) {
      router.push('/auth/signin');
    }
  }, [status, session, router]);

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/categoria?limite=10&pagina=1`,
          {
            headers: {
              Authorization: `Bearer ${session?.user?.token}`,
            },
          }
        );
        const categoryData = response.data.map((cat: any) => ({
          id: cat.id,
          name: cat.nome,
        }));
        setCategories(categoryData);
      } catch (err) {
        console.error('Erro ao carregar categorias:', err);
        setError('Erro ao carregar categorias.');
      }
    };

    if (session?.user?.token) {
      fetchCategories();
    }
  }, [session]);

  useEffect(() => {
    if (id && session?.user?.token) {
      const fetchPostData = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`,
            {
              headers: {
                Authorization: `Bearer ${session?.user?.token}`,
              },
            }
          );

          const post = response.data;
          setTitle(post.titulo);
          setDescription(post.descricao);
          setImageUrl(post.imagemUrl);
          setSelectedCategoryId(post.categoria.id);
          setCategoryName(post.categoria.nome);
          setIsActive(post.ativo);
        } catch (err) {
          console.error('Erro ao carregar dados da postagem:', err);
          setError('Erro ao carregar dados da postagem.');
        }
      };

      fetchPostData();
    }
  }, [id, session]);

  const handleCategoryChange = (value: string) => {
    setCategoryName(value);

    // Verifica se a categoria selecionada já existe
    const selectedCategory = categories.find((category) => category.name === value);
    if (selectedCategory) {
      setSelectedCategoryId(selectedCategory.id); // Categoria existente
    } else {
      setSelectedCategoryId(null); // Nova categoria
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`,
        {
          titulo: title,
          descricao: description,
          imagemUrl: imageUrl,
          ativo: isActive,
          categoria: { 
            id: selectedCategoryId, 
            nome: categoryName 
          },
        },
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`,
          },
        }
      );

      router.push('/admin/');
    } catch (err) {
      console.error('Erro ao editar postagem:', err);
      setError('Erro ao editar postagem. Verifique sua conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-5">
      <div className="bg-white shadow-md rounded-lg w-full max-w-2xl p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Editar Postagem</h1>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">URL da Imagem (opcional)</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Preview"
                className="mt-4 w-full h-auto max-h-64 object-cover border border-gray-300 rounded-lg"
              />
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Nome da Categoria</label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => handleCategoryChange(e.target.value)}
              list="categories"
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
            <datalist id="categories">
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name} />
              ))}
            </datalist>
          </div>
          <div
            className="mb-4 cursor-pointer"
            onClick={() => setIsActive((prev) => !prev)}
          >
            <label className="block text-gray-700 mb-2">Status da Postagem</label>
            <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
              <div className={`toggle-label block h-6 rounded-full cursor-pointer ${isActive ? 'bg-green-400' : 'bg-gray-300'}`} />
              <div
                className={`toggle-checkbox absolute top-0 left-0 h-6 w-6 rounded-full bg-white border-4 transition-transform duration-200 ease-in transform ${isActive ? 'translate-x-6 border-green-400' : 'translate-x-0 border-gray-300'}`}
              />
            </div>
            <span className="text-gray-700">{isActive ? 'Ativo' : 'Inativo'}</span>
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              disabled={loading}
              className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 w-full mr-2"
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-600 w-full"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostPage;