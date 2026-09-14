import { useEffect, useState } from 'react';
import * as postsService from '../services/postsService';
import type { Post } from '../types';
import { ApiError } from '../services/api';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import PostCard from '../components/PostCard';

export default function PostListPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 400);

  useEffect(() => {
    let isCurrent = true;

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const result = debouncedQuery.trim()
          ? await postsService.searchPosts(debouncedQuery.trim())
          : await postsService.listPosts();

        if (isCurrent) setPosts(result);
      } catch (err) {
        if (isCurrent) {
          setError(err instanceof ApiError ? err.message : 'Não foi possível carregar os posts.');
        }
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    load();

    return () => {
      isCurrent = false;
    };
  }, [debouncedQuery]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">Últimos posts</h1>
          <p className="mt-1 text-sm text-ink/60">Conteúdo publicado pelos professores.</p>
        </div>

        <input
          type="search"
          placeholder="Buscar por palavra-chave..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded border border-border bg-white px-3 py-2 text-sm  focus:border-accent sm:w-64"
        />
      </div>

      <div className="mt-8 flex flex-col gap-4">
        {isLoading && (
          <>
            <div className="h-24 animate-pulse rounded border border-border bg-surface" />
            <div className="h-24 animate-pulse rounded border border-border bg-surface" />
            <div className="h-24 animate-pulse rounded border border-border bg-surface" />
          </>
        )}

        {!isLoading && error && <p className="text-sm text-red-700">{error}</p>}

        {!isLoading && !error && posts.length === 0 && (
          <p className="text-sm text-ink/60">
            {query ? 'Nenhum post encontrado para essa busca.' : 'Ainda não há posts publicados.'}
          </p>
        )}

        {!isLoading && !error && posts.map((post) => <PostCard key={post._id} post={post} />)}
      </div>
    </div>
  );
}