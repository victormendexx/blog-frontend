import { Link } from 'react-router-dom';
import type { Post } from '../types';
import { truncate, formatDate } from '../utils/text';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link
      to={`/posts/${post._id}`}
      className="block rounded border border-border bg-surface px-5 py-4 transition-colors hover:border-accent"
    >
      <h2 className="font-display text-xl font-semibold">{post.title}</h2>
      <p className="mt-1 text-xs text-ink/60">
        {post.author} · {formatDate(post.createdAt)}
      </p>
      <p className="mt-3 text-sm text-ink/80">{truncate(post.content, 160)}</p>
    </Link>
  );
}