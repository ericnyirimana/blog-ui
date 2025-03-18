import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { login, logout, getUser, getAuthHeader } from './auth';

describe('Authentication', () => {
  const mockUser = {
    id: '123',
    email: 'test@example.com',
    name: 'Test User',
    picture: 'https://example.com/avatar.jpg'
  };

  const mockToken = btoa(JSON.stringify(mockUser));

  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  describe('getUser', () => {
    it('should return null when no user is logged in', () => {
      expect(getUser()).toBeNull();
    });

    it('should return user data when logged in', () => {
      window.localStorage.setItem('token', mockToken);
      const user = getUser();
      expect(user).toEqual(mockUser);
    });

    it('should handle invalid token', () => {
      window.localStorage.setItem('token', 'invalid-token');
      expect(getUser()).toBeNull();
    });

    it('should return null during SSR', () => {
      const windowSpy = vi.spyOn(global, 'window', 'get');
      windowSpy.mockImplementation(() => undefined as any);
      expect(getUser()).toBeNull();
      windowSpy.mockRestore();
    });
  });

  describe('login', () => {
    it('should store user token', async () => {
      await login(mockToken);
      expect(window.localStorage.setItem).toHaveBeenCalledWith('token', mockToken);
    });
  });

  describe('logout', () => {
    it('should remove token', async () => {
      window.localStorage.setItem('token', mockToken);
      await logout();
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('token');
    });
  });

  describe('getAuthHeader', () => {
    it('should return empty object when no token exists', () => {
      expect(getAuthHeader()).toEqual({});
    });

    it('should return authorization header when token exists', () => {
      window.localStorage.setItem('token', mockToken);
      expect(getAuthHeader()).toEqual({
        Authorization: `Bearer ${mockToken}`
      });
    });

    it('should handle SSR', () => {
      const windowSpy = vi.spyOn(global, 'window', 'get');
      windowSpy.mockImplementation(() => undefined as any);
      expect(getAuthHeader()).toEqual({});
      windowSpy.mockRestore();
    });
  });
});