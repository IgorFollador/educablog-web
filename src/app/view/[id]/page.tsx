'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ViewPostPage = () => {
  const router = useRouter(); 
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [isActive, setIsActive] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const { id } = useParams();

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`);
        const post = response.data;

        setTitle(post.titulo);
        setDescription(post.descricao);
        setImageUrl(post.imagemUrl);
        setCategoryName(post.categoria.nome);
        setIsActive(post.ativo);
      } catch (err) {
        console.error('Erro ao carregar dados da postagem:', err);
        setError('Erro ao carregar dados da postagem.');
      }
    };

    if (id) {
      fetchPostData();
    }
  }, [id]);

  const handleBack = () => {
    router.push('/');
  };

  return (
    <>
    <Header/>
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-5">
      <div className="bg-white shadow-md rounded-lg w-full max-w-2xl p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Visualizar Postagem</h1>
        {error && <p className="text-red-500">{error}</p>}
        <div>
          <div className="mb-4">
            <label className="block text-gray-700">Título</label>
            <p className="mt-1 p-2 border border-gray-300 rounded bg-gray-100">{title}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Descrição</label>
            <p className="mt-1 p-2 border border-gray-300 rounded bg-gray-100">{description}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">URL da Imagem</label>
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Imagem da postagem"
                className="mt-4 w-full h-auto max-h-64 object-cover border border-gray-300 rounded-lg"
              />
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Categoria</label>
            <p className="mt-1 p-2 border border-gray-300 rounded bg-gray-100">{categoryName}</p>
          </div>
        </div>
         <div className="mt-6 flex justify-center">
          <button
            onClick={handleBack}
            className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Voltar
          </button>
          </div>
      </div>
      
    </div>
    <Footer/>
    </>
  );
};

export default ViewPostPage;
