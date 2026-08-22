import { createRouter } from "@tanstack/react-router";
import { routeTree }  from './routeTree.gen';
import type { AuthContextType } from "./context/AuthContext";
import { QueryClient } from "@tanstack/react-query";

export interface RouterContext {
  queryClient: QueryClient;   
}

export const router = createRouter({
    routeTree,
    context: {
        queryClient: undefined!, // Supplied at render time in App.tsx
    } as RouterContext,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
    }
}