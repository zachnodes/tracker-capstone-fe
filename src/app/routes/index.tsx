import { createFileRoute } from '@tanstack/react-router'
import { LoginPage } from '../components/LoginPage'

function IndexPage() {
    return <LoginPage />;
}

export const Route = createFileRoute('/')({
  component: IndexPage,
});
