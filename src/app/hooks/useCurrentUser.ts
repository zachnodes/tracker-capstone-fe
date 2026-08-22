import { useQuery } from '@tanstack/react-query';
import { endpoints } from '../api/endpoints';

interface CurrentUser {
  userId: string;
  email: string;
}

export function useCurrentUser() {
    return useQuery({
        queryKey: ['currentUser'],
        queryFn: async () => {
            const response = await fetch(endpoints.me, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // Include cookies in the request
            });

            if (!response.ok) {
                return null; // Return null if the request fails (e.g., user is not authenticated)
            }

            return response.json();

        },
        retry: false, // Do not retry on failure
    });
}