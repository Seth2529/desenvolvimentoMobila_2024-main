import React, {ReactNode, createContext, useContext, useState } from "react";

interface AuthContextProps{
    user:string| null;
    setUser: (user: string| null) => void;
    logout: () => void;

}

const AuthContext = createContext<AuthContextProps| undefined>(undefined);

export const AuthProvider: React.FC<{children:ReactNode}> = ({children}) => {
    const [user,setUser] = useState<string|null>(null);

    const logout = () => {
        setUser(null);
    };

    
    return(
        <AuthContext.Provider value = {{user,setUser,logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined){
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};