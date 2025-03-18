import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { login, logout, getUser } from './auth';

describe('Authentication', () => {
  const mockUser = {
    id: '123',
    email: 'test@example.com',
    name: 'Test User',
    picture: 'https://example.com/avatar.jpg'
  };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should store user token on login', async () => {
    const token = btoa(JSON.stringify(mockUser));
    await login(token);
    expect(localStorage.getItem('token')).toBe(token);
  });

  it('should remove token on logout', async () => {
    const token = btoa(JSON.stringify(mockUser));
    localStorage.setItem('token', token);
    await logout();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('should return null when no user is logged in', () => {
    expect(getUser()).toBeNull();
  });

  it('should return user data when logged in', () => {
    const token = btoa(JSON.stringify(mockUser));
    localStorage.setItem('token', token);
    const user = getUser();
    expect(user).toEqual(mockUser);
  });

  it('should handle invalid token', () => {
    localStorage.setItem('token', 'invalid-token');
    expect(getUser()).toBeNull();
  });
});