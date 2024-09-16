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
  isAdmin?: boolean;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
}

const PostList: React.FC<PostListProps> = ({ posts = [], isAdmin = false, onEdit, onDelete }) => {
  // Adicionando uma verificação para garantir que 'posts' é um array
  if (!Array.isArray(posts) || posts.length === 0) {
    return <p>Nenhuma postagem encontrada.</p>;
  }

  return (
    <ul className="space-y-6">
      {posts.map((post) => (
        <li key={post.id} className="border border-gray-300 p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-2">{post.titulo}</h2>
          <p className="mb-4">{post.descricao}</p>
          {post.imagemUrl && (
            <div className="w-full h-64 mb-4">
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
          {/* Ações de admin */}
          {isAdmin && (
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => onEdit && onEdit(post.id)}
                className="py-1 px-3 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Editar
              </button>
              <button
                onClick={() => onDelete && onDelete(post.id)}
                className="py-1 px-3 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Deletar
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default PostList;
