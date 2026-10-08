export interface AuthUserDto {
  id: string;
  email: string;
  role: string;
  partner_name: string;
  name?: string;
  full_name?: string;
  displayName?: string;
  photoURL?: string;
  uid?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export const getAuthUser = (payload: unknown): AuthUserDto | null => {
  if (!isRecord(payload)) return null;
  const data = isRecord(payload.data) ? payload.data : null;
  const candidate = payload.user ?? data?.user ?? data ?? payload;
  if (!isRecord(candidate)) return null;

  const id = candidate.id;
  const email = candidate.email;
  const role = candidate.role;
  if ((typeof id !== 'string' && typeof id !== 'number')
    || (typeof id === 'number' && !Number.isFinite(id))
    || String(id).trim() === '') {
    return null;
  }
  if (typeof email !== 'string' || !email.trim() || typeof role !== 'string' || !role.trim()) {
    return null;
  }

  const partner = candidate.partner_name ?? candidate.partner;
  const user: AuthUserDto = {
    id: String(id),
    email: email.trim(),
    role: role.trim(),
    partner_name: typeof partner === 'string' ? partner.trim() : '',
  };
  for (const field of ['name', 'full_name', 'displayName', 'photoURL', 'uid'] as const) {
    if (typeof candidate[field] === 'string') user[field] = candidate[field] as string;
  }
  return user;
};
