import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { api } from './api';
import {API_URL} from '@/lib/constant';

const server = setupServer(
  // Mock posts endpoints
  http.get(`${API_URL}/posts`, () => {
    return HttpResponse.json([
      { id: 1, title: 'Test Post', body: 'Test Content', userId: 1 }
    ]);
  }),
  
  http.get(`${API_URL}/posts/1`, () => {
    return HttpResponse.json(
      { id: 1, title: 'Test Post', body: 'Test Content', userId: 1 }
    );
  }),

  // Mock comments endpoints
  http.get(`${API_URL}/posts/1/comments`, () => {
    return HttpResponse.json([
      { id: 1, postId: 1, name: 'Test User', email: 'test@example.com', body: 'Test Comment' }
    ]);
  }),

  // Mock users endpoints
  http.get(`${API_URL}/users/1`, () => {
    return HttpResponse.json(
      { id: 1, name: 'Test User', email: 'test@example.com', username: 'testuser' }
    );
  })
);

describe('API Client', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  describe('Posts', () => {
    it('should fetch posts', async () => {
      const posts = await api.posts.getAll(1, 10);
      expect(posts).toHaveLength(1);
      expect(posts[0]).toHaveProperty('title', 'Test Post');
    });

    it('should fetch a single post', async () => {
      const post = await api.posts.getById('1');
      expect(post).toHaveProperty('title', 'Test Post');
    });

    it('should create a post', async () => {
      const newPost = {
        title: 'New Post',
        body: 'New Content',
        userId: 1
      };

      server.use(
        http.post(`${API_URL}/posts`, () => {
          return HttpResponse.json({ id: 2, ...newPost });
        })
      );

      const post = await api.posts.create(newPost);
      expect(post).toHaveProperty('id', 2);
      expect(post).toHaveProperty('title', 'New Post');
    });
  });

  describe('Comments', () => {
    it('should fetch comments for a post', async () => {
      const comments = await api.comments.getByPost('1');
      expect(comments).toHaveLength(1);
      expect(comments[0]).toHaveProperty('body', 'Test Comment');
    });

    it('should create a comment', async () => {
      const newComment = {
        postId: 1,
        name: 'Test User',
        email: 'test@example.com',
        body: 'New Comment'
      };

      server.use(
        http.post(`${API_URL}/comments`, () => {
          return HttpResponse.json({ id: 2, ...newComment });
        })
      );

      const comment = await api.comments.create(newComment);
      expect(comment).toHaveProperty('id', 2);
      expect(comment).toHaveProperty('body', 'New Comment');
    });
  });

  describe('Users', () => {
    it('should fetch a user', async () => {
      const user = await api.users.getById('1');
      expect(user).toHaveProperty('name', 'Test User');
    });

    it('should fetch multiple users', async () => {
      const users = await api.users.getByIds([1]);
      expect(users).toHaveLength(1);
      expect(users[0]).toHaveProperty('name', 'Test User');
    });
  });
});