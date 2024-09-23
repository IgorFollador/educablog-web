'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { DiscussionEmbed } from 'disqus-react';
import Spinner from '@/components/Spinner';
import DOMPurify from 'dompurify';

interface DisqusConfig {
  url?: string;
  identifier?: string;
  title?: string;
  language?: string
}

const ViewPostPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [authorName, setAuthorName] = useState<string | null>(null); 
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchPostData = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`
          );
          const post = response.data;
          setTitle(post.titulo);
          setDescription(post.descricao);
          setImageUrl(post.imagemUrl);
          if (post.categoria) {
            setCategoryName(post.categoria.nome.toUpperCase());
          }
          if (post.usuarioCriacao?.pessoa?.nome) {
            setAuthorName(post.usuarioCriacao.pessoa.nome);
          }
        } catch (err) {
          setError('Erro ao carregar dados da postagem.');
        } finally {
          setLoading(false);
        }
      };

      fetchPostData();
    }
  }, [id]);

  const handleBack = () => {
    router.push('/');
  };

  const disqusShortname = process.env.NEXT_PUBLIC_DISQUS_NAME || "";
  const disqusConfig: DisqusConfig = {
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/posts/${id}`,
    identifier: Array.isArray(id) ? id[0] : id, // Corrigindo o erro de tipo
    title,
    language: 'pt-BR',
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-5">
      <div className="bg-white shadow-md rounded-lg w-full max-w-2xl p-6">
        <h1 className="text-3xl font-bold text-center mb-6">{title}</h1>
        {error && <p className="text-red-500">{error}</p>}
        <div className="mb-4">
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Imagem do Post"
              className="mt-4 w-full h-auto max-h-64 object-cover border border-gray-300 rounded-lg"
            />
          )}
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-bold">Descrição</h2>
          <div
            className="mt-2 text-gray-700"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description) }}
          />
        </div>
        <div className="flex justify-between mb-6">
          {authorName && (
            <div>
              <h3 className="text-lg font-semibold">Autor</h3>
              <p className="mt-2 text-gray-700">{authorName}</p>
            </div>
          )}
          {categoryName && (
            <div className="text-right">
              <h3 className="text-lg font-semibold">Categoria</h3>
              <p className="mt-2 text-gray-700">{categoryName}</p>
            </div>
          )}
        </div>
        <div className="flex justify-start mb-6">
          <button
            type="button"
            onClick={handleBack}
            className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Voltar
          </button>
        </div>
        <div className="mb-4">
          <div className="mt-2 border-t border-gray-300 pt-4">
            <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPostPage;
