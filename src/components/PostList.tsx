import React from 'react';

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

interface PostListProps {
  posts: Post[];
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
  return (
    <ul className="space-y-6">
      {posts.map((post) => (
        <li key={post.id} className="border border-gray-300 p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-2">{post.titulo}</h2>
          <p className="mb-4">{post.descricao}</p>
          {post.imagemUrl && (
            <div className="relative w-full h-64 mb-4">
              <img
                src={post.imagemUrl}
                alt={post.titulo}
                className="object-cover w-full h-full rounded"
              />
            </div>
          )}
          {post.categoria && <p className="italic text-gray-600">Categoria: {post.categoria.nome}</p>}
          <small className="text-gray-500">
            Publicado em: {new Date(post.dataCriacao).toLocaleDateString()}
          </small>
        </li>
      ))}
    </ul>
  );
};

export default PostList;
