export interface Post {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostInput {
  title: string;
  content: string;
  author: string;
}

export type UpdatePostInput = Partial<CreatePostInput>;

export interface Teacher {
  id: string;
  name: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  teacher: Teacher;
}