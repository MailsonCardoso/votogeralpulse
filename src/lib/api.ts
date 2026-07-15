const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(body.error ?? res.statusText)
  }
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

export type Resource =
  | 'funcionarios'
  | 'liderancas'
  | 'cabos'
  | 'eleitores'
  | 'visitas'
  | 'pesquisas'
  | 'eventos'
  | 'conversas'
  | 'movimentacoes'
  | 'notificacoes'
  | 'atividades'

export const api = {
  list: <T>(resource: Resource) => request<T[]>(`/${resource}`),
  get: <T>(resource: Resource, id: string) => request<T>(`/${resource}/${id}`),
  create: <T>(resource: Resource, data: Partial<T>) =>
    request<T>(`/${resource}`, { method: 'POST', body: JSON.stringify(data) }),
  update: <T>(resource: Resource, id: string, data: Partial<T>) =>
    request<T>(`/${resource}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (resource: Resource, id: string) =>
    request<void>(`/${resource}/${id}`, { method: 'DELETE' }),
}
