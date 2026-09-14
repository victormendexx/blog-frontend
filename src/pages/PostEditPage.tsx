import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PostForm from '../components/PostForm';
import * as postsService from '../services/postsService';
import type { CreatePostInput, Post } from '../types';
import { ApiError } from '../services/api';

export default function PostEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    postsService
      .getPost(id)
      .then(setPost)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Erro ao carregar o post.'))
      .finally(() => setIsLoading(false));
  }, [id]);

  async function handleSubmit(data: CreatePostInput): Promise<void> {
    if (!id) return;
    await postsService.updatePost(id, data);
    navigate(`/posts/${id}`);
  }

  if (isLoading) {
    return <div className="mx-auto max-w-3xl px-4 py-10 text-ink/70">Carregando...</div>;
  }

  if (error || !post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-sm text-red-700">{error ?? 'Post não encontrado.'}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">Editar post</h1>
      <PostForm
        initialValues={{ title: post.title, content: post.content, author: post.author }}
        submitLabel="Salvar alterações"
        onSubmit={handleSubmit}
      />
    </div>
  );
}