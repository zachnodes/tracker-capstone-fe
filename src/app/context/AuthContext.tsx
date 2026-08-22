import { createContext, useContext, useState, ReactNode } from 'react';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useQueryClient } from '@tanstack/react-query';

export interface AuthContextType { 
    isAuthenticated: boolean;
    isLoading: boolean;
    
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { data: currentUser, isLoading } = useCurrentUser();
  
    

    return (
        <AuthContext.Provider 
        value={{
            isAuthenticated: currentUser !== null && currentUser !== undefined,
            isLoading
        }}>
            {children}
        </AuthContext.Provider>
    );

    
}

