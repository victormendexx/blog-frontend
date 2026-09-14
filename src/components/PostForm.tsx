import { useState, type FormEvent } from 'react';
import type { CreatePostInput } from '../types';

interface PostFormProps {
  initialValues?: CreatePostInput;
  submitLabel: string;
  onSubmit: (data: CreatePostInput) => Promise<void>;
}

export default function PostForm({ initialValues, submitLabel, onSubmit }: PostFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [content, setContent] = useState(initialValues?.content ?? '');
  const [author, setAuthor] = useState(initialValues?.author ?? '');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent): Promise<void> {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit({ title, content, author });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar o post.');
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          Título
        </label>
        <input
          id="title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded border border-border bg-white px-3 py-2 text-sm  focus:border-accent"
        />
      </div>

      <div>
        <label htmlFor="author" className="block text-sm font-medium">
          Autor
        </label>
        <input
          id="author"
          type="text"
          required
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="mt-1 w-full rounded border border-border bg-white px-3 py-2 text-sm  focus:border-accent"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium">
          Conteúdo
        </label>
        <textarea
          id="content"
          required
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-1 w-full resize-y rounded border border-border bg-white px-3 py-2 text-sm  focus:border-accent"
        />
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 self-start rounded bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
      >
        {isSubmitting ? 'Salvando...' : submitLabel}
      </button>
    </form>
  );
}