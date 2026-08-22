import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from './useAuth';
import { endpoints } from '../api/endpoints';
import { router } from '../router';
import { flushSync } from 'react-dom';
import { useQueryClient } from '@tanstack/react-query';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

export function useLogin() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async ({ email, password }: LoginCredentials) => {
             const response = await fetch(endpoints.login, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // Include cookies in the request
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                // want to handle better
                const errorBody = await response.json().catch(() => null);
                throw new Error(errorBody?.message ?? 'Login failed');
            }

            // No token is returned in the response body, but the server sets a cookie for authentication
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['currentUser'] });
            navigate({ to: '/dashboard' });
        }
    });

}