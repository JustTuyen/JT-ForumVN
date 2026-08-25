import { createContext, useContext, useState, useEffect } from "react";
import api from "./ApiHandle";

const AuthContext = createContext(null)
export function AuthProvider({ children }){
    const [user, setUser] = useState(null);
    const [loading, setLoading ] = useState(true)
    
    const fetchCurrentUser = async() =>{
        try{
            const {data} = await api.get('/api/users/me/')
            setUser(data)
        } catch{
            logout()
        } finally{
            setLoading(false)
        }
        
    }
    const login = async (username, password) => {
        const { data } = await api.post('/api/token/', { username, password });
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
       
       
        const { data: profile } = await api.get('/api/users/me/');
        setUser(profile);
        return profile;
    };

    const logout = () =>{
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        window.location.href = '/'
    }


    useEffect(() => {
        let isMounted = true;

        async function initAuth() {
            const token = localStorage.getItem('access_token');
            if (!token) {
                if (isMounted) setLoading(false);
                return;
            }
            await fetchCurrentUser();
        }

        initAuth();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
        {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);