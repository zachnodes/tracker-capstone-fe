import { LoginPage } from "./components/LoginPage";
import { Dashboard } from "./components/Dashboard";
import { useAuth } from "./hooks/useAuth";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";

export default function App() {
  const auth = useAuth();
  return <RouterProvider router={router} context={{auth}} />
    

}