import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import * as postsService from '../services/postsService';
import type { Post } from '../types';
import { ApiError } from '../services/api';
import { formatDate } from '../utils/text';

export default function PostReadPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setIsLoading(true);
    postsService
      .getPost(id)
      .then(setPost)
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : 'Não foi possível carregar o post.'),
      )
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return <div className="mx-auto max-w-3xl px-4 py-10 text-ink/70">Carregando...</div>;
  }

  if (error || !post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-sm text-red-700">{error ?? 'Post não encontrado.'}</p>
        <Link to="/" className="mt-4 inline-block text-sm text-accent hover:underline">
          ← Voltar para os posts
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <Link to="/" className="text-sm text-accent hover:underline">
        ← Voltar para os posts
      </Link>

      <h1 className="mt-4 font-display text-4xl font-semibold">{post.title}</h1>
      <p className="mt-2 text-sm text-ink/60">
        {post.author} · {formatDate(post.createdAt)}
      </p>

      <div className="mt-6 whitespace-pre-wrap text-base leading-relaxed text-ink/90">
        {post.content}
      </div>
    </article>
  );
}