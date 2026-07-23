import { LoginPage } from "./components/LoginPage";
import { Dashboard } from "./components/Dashboard";
import { useAuth } from "./hooks/useAuth";

export default function App() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="size-full">
      {<LoginPage/>}
    </div>
  );
}