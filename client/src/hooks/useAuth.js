import { useContext } from 'react';
import { AuthContext } from '../context/Auth.jsx';

export function useAuth() {
  return useContext(AuthContext);
}