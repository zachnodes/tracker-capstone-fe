import { useMutation, useQueryClient } from '@tanstack/react-query';
import { endpoints } from '../api/endpoints';
import { useNavigate } from '@tanstack/react-router';

export function useLogout() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async () => {
            const response = await fetch(endpoints.logout, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            if (!response.ok) {
                // need to handle better
                const errorBody = await response.json().catch(() => null);
                throw new Error(errorBody?.message ?? 'Failed to logout');
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['currentUser'] });
            navigate({ to: '/login' });
        }
    });
}