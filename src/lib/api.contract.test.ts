import assert from 'node:assert/strict';
import test from 'node:test';
import { getAuthUser } from './authUser.ts';

test('getAuthUser normalizes a valid API user and excludes unrelated credential fields', () => {
  const user = getAuthUser({
    data: {
      id: 12,
      email: '  admin@example.test  ',
      role: 'Klien',
      partner_name: null,
      name: 'Admin',
      password_hash: 'must-not-be-stored',
    },
  });

  assert.deepEqual(user, {
    id: '12',
    email: 'admin@example.test',
    role: 'Klien',
    partner_name: '',
    name: 'Admin',
  });
});

test('getAuthUser rejects incomplete identity data', () => {
  assert.equal(getAuthUser({ data: { email: 'admin@example.test' } }), null);
});
