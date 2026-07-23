import { useMutation } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { endpoints } from '../api/endpoints';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

export function useLogin() {
    const { login } = useAuth();

    return useMutation({
        mutationFn: async ({ email, password }: LoginCredentials) => {
             const response = await fetch(endpoints.login, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorBody = await response.json().catch(() => null);
                throw new Error(errorBody?.message ?? 'Login failed');
            }

            const data : LoginResponse = await response.json();
            
            return data.token;
        },
        onSuccess: (token) => {
            login(token);
        }
    });

}