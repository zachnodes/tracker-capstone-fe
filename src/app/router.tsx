import { createRouter } from "@tanstack/react-router";
import { routeTree }  from './routeTree.gen';
import type { AuthContextType } from "./context/AuthContext";

export interface RouterContext {
  auth: AuthContextType;   
}

export const router = createRouter({
    routeTree,
    context: {
        auth: undefined!, // Supplied at render time in App.tsx
    } as RouterContext,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
    }
}