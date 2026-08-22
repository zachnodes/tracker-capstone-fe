import { createFileRoute, redirect } from '@tanstack/react-router';
import { Dashboard } from '../../components/Dashboard';
import { endpoints } from '../../api/endpoints';

export const Route = createFileRoute('/dashboard/')({
    beforeLoad: async ({ context }) => {
        const user = await context.queryClient.ensureQueryData({ 
            queryKey: ['currentUser'],
            queryFn: async () => {
                const response = await fetch(endpoints.me, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });

                if (!response.ok) {
                    return null; // Return null if the request fails (e.g., user is not authenticated)
                }

                return response.json();
            }
        });
        if (!user) {
            throw redirect({ to: '/login' });
        }
    },
  component: Dashboard,
})

