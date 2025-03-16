"use client";

import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export function getUser(): User | null {
  const token = localStorage.getItem("token");
  if (!token) return null;
  
  try {
    return jwtDecode(token) as User;
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

export function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}