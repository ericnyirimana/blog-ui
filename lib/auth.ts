"use client";

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  const token = window.localStorage.getItem("token");
  if (!token) return null;
  
  try {
    return JSON.parse(atob(token)) as User;
  } catch {
    return null;
  }
}

export async function login(token: string) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem("token", token);
  }
}

export async function logout() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem("token");
  }
}

export function getAuthHeader() {
  if (typeof window === 'undefined') return {};
  
  const token = window.localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}