"use client";

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

interface AuthHeader {
  Authorization?: string;
}

export function getUser(): User | null {
  const token = localStorage.getItem("token");
  if (!token) return null;
  
  try {
    return JSON.parse(atob(token)) as User;
  } catch {
    return null;
  }
}

export async function login(token: string) {
  localStorage.setItem("token", token);
}

export async function logout() {
  localStorage.removeItem("token");
}

export function getAuthHeader(): AuthHeader {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}