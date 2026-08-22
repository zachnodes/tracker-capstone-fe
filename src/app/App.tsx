import { LoginPage } from "./components/LoginPage";
import { Dashboard } from "./components/Dashboard";
import { useAuth } from "./hooks/useAuth";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";
import { useQueryClient } from "@tanstack/react-query";

export default function App() {
  const queryClient = useQueryClient();
  return <RouterProvider router={router} context={{queryClient}} />
    

}