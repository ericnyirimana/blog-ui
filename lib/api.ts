import { getAuthHeader } from './auth';

const API_URL = 'https://jsonplaceholder.typicode.com';

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

export const api = {
  posts: {
    getAll: async (page = 1, limit = 10): Promise<Post[]> => {
      const start = (page - 1) * limit;
      const response = await fetch(`${API_URL}/posts?_start=${start}&_limit=${limit}`);
      return response.json();
    },

    getById: async (id: string): Promise<Post> => {
      const response = await fetch(`${API_URL}/posts/${id}`);
      return response.json();
    },

    create: async (data: Omit<Post, 'id'>): Promise<Post> => {
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },

    update: async (id: string, data: Partial<Post>): Promise<Post> => {
      const response = await fetch(`${API_URL}/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },

    delete: async (id: string): Promise<void> => {
      await fetch(`${API_URL}/posts/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });
    },
  },

  comments: {
    getByPost: async (postId: string): Promise<Comment[]> => {
      const response = await fetch(`${API_URL}/posts/${postId}/comments`);
      return response.json();
    },

    create: async (data: Omit<Comment, 'id'>): Promise<Comment> => {
      const response = await fetch(`${API_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },
  },

  users: {
    getById: async (id: string): Promise<User> => {
      const response = await fetch(`${API_URL}/users/${id}`);
      return response.json();
    },

    getByIds: async (ids: number[]): Promise<User[]> => {
      const promises = ids.map(id => api.users.getById(id.toString()));
      return Promise.all(promises);
    },
  },
};