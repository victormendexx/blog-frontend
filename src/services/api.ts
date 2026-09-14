const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const TOKEN_KEY = 'mural_token';

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Wrapper de fetch que já: monta a URL completa, injeta o token de auth
 * (se existir um salvo), desembrulha o envelope {success, data}/{error}
 * e lança ApiError em caso de falha.
 */
export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const body: ApiEnvelope<T> = await response.json();

  if (!response.ok || !body.success) {
    throw new ApiError(body.error || 'Erro inesperado na API', response.status);
  }

  return body.data as T;
}