# Modern Blog Platform

A full-featured blog platform built with Next.js, and shadcn/ui. Features include user authentication, post creation/management, commenting system, and a beautiful responsive design.

## Features

- 🔐 User Authentication with Google
- 📝 Create, Read, Update, Delete Blog Posts
- 💬 Commenting System
- 🎨 Beautiful UI with shadcn/ui Components
- 🌓 Dark Mode
- 📱 Fully Responsive Design
- ✨ Modern Stack: Next.js, TypeScript, Tailwind CSS
- 🧪 Comprehensive Test Suite

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- A Google OAuth Client ID (for authentication)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

## Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
cd blog-ui
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
├── app/                  # Next.js app directory
│   ├── auth/            # Authentication routes
│   ├── posts/           # Post-related pages
├── components/          # React components
│   ├── ui/             # UI components (shadcn/ui)
│   └── ...             # Other components
├── lib/                 # Utility functions and types
│   ├── api.ts          # API client
│   ├── auth.ts         # Authentication utilities
│   └── ...             # Other utilities
├── public/             # Static assets
```

## Testing

Run the test suite:

```bash
npm run test
```

## Building for Production

Build the application:

```bash
npm run build
```

## Deployment

The project is configured for static exports and can be deployed to any static hosting platform. For the best experience, we recommend using Netlify:

1. Connect your repository to Netlify
2. Set up the environment variables
3. Deploy!

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request