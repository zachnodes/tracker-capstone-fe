import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType { 
    crendentials: string | null;
    login: (encodedCredentials: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [crendentials, setCredentials] = useState<string | null>(null);
    
    const login = (encodedCredentials: string) => {
        setCredentials(encodedCredentials);
    };

    const logout = () => {
        setCredentials(null);
    }

    return (
        <AuthContext.Provider value={{ crendentials, login, logout, isAuthenticated: crendentials != null }}>
            {children}
        </AuthContext.Provider>
    );

    
}

