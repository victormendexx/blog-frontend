import { apiFetch } from './api';
import type { Post, CreatePostInput, UpdatePostInput } from '../types';

export function listPosts(): Promise<Post[]> {
  return apiFetch<Post[]>('/posts');
}

export function getPost(id: string): Promise<Post> {
  return apiFetch<Post>(`/posts/${id}`);
}

export function searchPosts(query: string): Promise<Post[]> {
  return apiFetch<Post[]>(`/posts/search?q=${encodeURIComponent(query)}`);
}

export function createPost(data: CreatePostInput): Promise<Post> {
  return apiFetch<Post>('/posts', { method: 'POST', body: JSON.stringify(data) });
}

export function updatePost(id: string, data: UpdatePostInput): Promise<Post> {
  return apiFetch<Post>(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function deletePost(id: string): Promise<null> {
  return apiFetch<null>(`/posts/${id}`, { method: 'DELETE' });
}