import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as postsService from '../services/postsService';
import type { Post } from '../types';
import { ApiError } from '../services/api';
import { formatDate } from '../utils/text';

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function load(): void {
    setIsLoading(true);
    setError(null);
    postsService
      .listPosts()
      .then(setPosts)
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : 'Erro ao carregar os posts.'),
      )
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  async function handleDelete(post: Post): Promise<void> {
    const confirmed = window.confirm(
      `Excluir o post "${post.title}"? Essa ação não pode ser desfeita.`,
    );
    if (!confirmed) return;

    setDeletingId(post._id);
    try {
      await postsService.deletePost(post._id);
      setPosts((current) => current.filter((p) => p._id !== post._id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erro ao excluir o post.');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">Administração</h1>
        <Link
          to="/admin/new"
          className="rounded bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          Novo post
        </Link>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {isLoading && <p className="text-sm text-ink/60">Carregando...</p>}

        {!isLoading && error && <p className="text-sm text-red-700">{error}</p>}

        {!isLoading && !error && posts.length === 0 && (
          <p className="text-sm text-ink/60">Nenhum post publicado ainda.</p>
        )}

        {!isLoading &&
          !error &&
          posts.map((post) => (
            <div
              key={post._id}
              className="flex flex-col gap-2 rounded border border-border bg-surface px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{post.title}</p>
                <p className="text-xs text-ink/60">
                  {post.author} · {formatDate(post.createdAt)}
                </p>
              </div>

              <div className="flex shrink-0 gap-1 text-sm">
                <Link
                  to={`/admin/edit/${post._id}`}
                  className="rounded px-2 py-1 text-accent hover:underline"
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(post)}
                  disabled={deletingId === post._id}
                  className="rounded px-2 py-1 text-red-700 hover:underline disabled:opacity-60"
                >
                  {deletingId === post._id ? 'Excluindo...' : 'Excluir'}
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}