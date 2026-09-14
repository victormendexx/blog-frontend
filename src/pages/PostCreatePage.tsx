import { useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import * as postsService from '../services/postsService';
import { useAuth } from '../context/AuthContext';
import type { CreatePostInput } from '../types';

export default function PostCreatePage() {
  const navigate = useNavigate();
  const { teacher } = useAuth();

  async function handleSubmit(data: CreatePostInput): Promise<void> {
    const post = await postsService.createPost(data);
    navigate(`/posts/${post._id}`);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">Novo post</h1>
      <PostForm
        initialValues={{ title: '', content: '', author: teacher?.name ?? '' }}
        submitLabel="Publicar"
        onSubmit={handleSubmit}
      />
    </div>
  );
}