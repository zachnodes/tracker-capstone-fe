import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { MatchesPage } from '../../components/MatchesPage';
import { endpoints } from '../../api/endpoints';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useLogout } from '../../hooks/useLogout';

function MatchesRoute() {
  const navigate = useNavigate();
  const logoutMutation = useLogout();
  const { data: user } = useCurrentUser();

  function handleBack() {
    navigate({ to: '/dashboard' });
  }

  function handleLogout() {
    logoutMutation.mutate();
    navigate({ to: '/login' });
  }

  return (
    <MatchesPage
      username={user?.email ?? ''}
      onBack={handleBack}
      onLogout={handleLogout}
    />
  );
}

export const Route = createFileRoute('/matches/')({
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
  component: MatchesRoute,
})