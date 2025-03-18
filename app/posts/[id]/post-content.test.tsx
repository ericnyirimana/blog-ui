import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { PostContent } from './post-content';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {API_URL} from '@/lib/constant';

// Mock the Card components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => <div data-testid="card" className={className}>{children}</div>,
  CardHeader: ({ children }: any) => <div data-testid="card-header">{children}</div>,
  CardContent: ({ children }: any) => <div data-testid="card-content">{children}</div>,
  CardTitle: ({ children }: any) => <div data-testid="card-title">{children}</div>,
  CardDescription: ({ children }: any) => <div data-testid="card-description">{children}</div>
}));

const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com'
};

const server = setupServer(
  http.get(`${API_URL}/posts/1`, () => {
    return HttpResponse.json({
      id: 1,
      title: 'Test Post',
      body: 'Test Content',
      userId: 1
    });
  }),

  http.get(`${API_URL}/posts/1/comments`, () => {
    return HttpResponse.json([
      {
        id: 1,
        postId: 1,
        name: 'Commenter',
        email: 'commenter@example.com',
        body: 'Test Comment'
      }
    ]);
  }),

  http.get(`${API_URL}/users/1`, () => {
    return HttpResponse.json({
      id: 1,
      name: 'Post Author',
      email: 'author@example.com',
      username: 'author'
    });
  })
);

describe('PostContent', () => {
  beforeAll(() => server.listen());
  afterEach(() => {
    server.resetHandlers();
    window.localStorage.clear();
    vi.clearAllMocks();
  });
  afterAll(() => server.close());

  it('should render loading state initially', () => {
    render(<PostContent id="1" />);
    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  it('should render post content after loading', async () => {
    render(<PostContent id="1" />);
    await waitFor(() => {
      expect(screen.getByText('Test Post')).toBeInTheDocument();
    });
  });

  it('should render comments section', async () => {
    render(<PostContent id="1" />);
    await waitFor(() => {
      expect(screen.getByText('Test Comment')).toBeInTheDocument();
    });
  });

  it('should show login prompt for unauthenticated users', async () => {
    render(<PostContent id="1" />);
    await waitFor(() => {
      expect(screen.getByText('Please sign in to join the discussion')).toBeInTheDocument();
    });
  });

  it('should show comment form for authenticated users', async () => {
    const token = btoa(JSON.stringify(mockUser));
    window.localStorage.setItem('token', token);
    render(<PostContent id="1" />);
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Share your thoughts...')).toBeInTheDocument();
    });
  });

  it('should handle comment submission', async () => {
    const user = userEvent.setup();
    const token = btoa(JSON.stringify(mockUser));
    window.localStorage.setItem('token', token);

    server.use(
      http.post(`${API_URL}/comments`, () => {
        return HttpResponse.json({
          id: 2,
          postId: 1,
          name: mockUser.name,
          email: mockUser.email,
          body: 'New Comment'
        });
      })
    );

    render(<PostContent id="1" />);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Share your thoughts...')).toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText('Share your thoughts...');
    await user.type(textarea, 'New Comment');
    
    const submitButton = screen.getByRole('button', { name: /post comment/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('New Comment')).toBeInTheDocument();
    });
  });
});