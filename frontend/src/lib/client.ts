import { z } from 'zod';

import { API_ROUTES } from '@/constants/api-routes';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function apiRequest<T>(
  path: string,
  schema: z.ZodType<T>,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? 'Não foi possível concluir a operação.');
  }
  if (response.status === 204) return schema.parse(undefined);
  return schema.parse(await response.json());
}

export { API_ROUTES };
