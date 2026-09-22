import axiosInstance from './axiosInstance.js';
import { supabase } from './supabase.js';

export async function signup(email, password, fullName) {
  const { data } = await axiosInstance.post('/auth/signup', {
    email,
    password,
    full_name: fullName,
  });
  return data;
}

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function logout() {
  await supabase.auth.signOut();
}

export async function getProfile() {
  const { data } = await axiosInstance.get('/auth/me');
  return data;
}