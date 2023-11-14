import { createContext, useContext, useEffect, useState } from 'react';
import { getUsersRequest, getUserRequest, createUserRequest, statusUserRequest, updateUserRequest, deleteUserRequest, loginRequest, verifyTokenRequest } from '../Api/User.request.js'
import { getWaitersRequest, createWaiterRequest } from '../Api/User.request.js';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom'; 


export const UserContext = createContext();

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("El useUser debe usarse dentro de UserProvider")
    }
    return context;
}

export const User = ({ children }) => {
    const [user, setUser] = useState([]);
    const [isAuthenticated, setisAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); 

   

    const getUsers = async () => {
        try {
            const res = await getUsersRequest();
            setUser(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getUser = async (id) => {
        try {
            const res = await getUserRequest(id);
            return res.data
        } catch (error) {
            console.error(error);
        }
    }
   

    const createUser = async (user) => {
        try {
            const res = await createUserRequest(user);
            getUsers();
            setisAuthenticated(true);
        } catch (error) {
            console.log(error);
        }
    }

    const toggleUserStatus = async (id) => {
        try {
            const res = await statusUserRequest(id);

            if (res.status === 200) {
                setUser((prevUser) =>
                    prevUser.map((users) =>
                    users.ID_User === id ? { ...users, State: !users.State } : users
                    )
                );
            }
        } catch (error) {
            console.log(error);
        }
    }

    const updateUser = async (id, users) => {
        try {
            await updateUserRequest(id, users);
            getUsers();
        } catch (error) {
            console.error(error);
        }
    }

    const deleteUser = async (id) => {
        try {
            const res = await deleteUserRequest(id)
            if (res.status === 204) setUser(user.filter(users => users.ID_User !== id))
        } catch (error) {
            console.log(error);
        }
    }

     //-------------------------------------login----------------------------------------------//
     const signin = async (userData) => {
        try {
            const res = await loginRequest(userData);
            if (res && res.data) {
                setisAuthenticated(true); // Establecer autenticación como verdadero
                setUser(res.data); // Actualizar el estado del usuario en el contexto
            }
        } catch (error) {
            console.log(error);
        }
    }
    
        useEffect(()=> {
            async function checkLogin() {
                const cookies = Cookies.get()
    
                //comprueba si hay un token, si no hay uno entonces la autenticación es false
                if (!cookies.token){
                    setisAuthenticated(false);
                    setLoading(false);
                    return setUser(null);
                }
                //si hay un token, envialo al backend, si no responde ningún dato entonces envialo a false
                //pero si sí hay uno entonces el usuario está autenticado y me muestra el usuario
                  try{
                    const res = await verifyTokenRequest(cookies.token)
                    if (!res.data){
                        setisAuthenticated(false);
                        setLoading(false);
                        return;
                    }
    
                    setisAuthenticated(true);
                    setUser(res.data);
                    setLoading(false);
                  }catch (error) {
                    console.log(error);
                    setisAuthenticated(false);
                    setUser(null);
                    setLoading(false);
                }
            }
            checkLogin();
            }, []);
                
            const logout = () =>{
                Cookies.remove("token");
                setisAuthenticated(false);
                setUser(null);
                navigate('/'); 
            }
           

    // --------------------------- Mesero --------------------------- //

    const getWaiters = async () => {
        try {
            const res = await getWaitersRequest();
            setUser(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const createWaiter = async (user) => {
        try {
            const res = await createWaiterRequest(user);
            getWaiters();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <UserContext.Provider
            value={{
                user,
                getUsers,
                getUser,
                createUser,
                toggleUserStatus,
                updateUser,
                deleteUser,
                // ---------- Mesero ---------- //
                getWaiters,
                createWaiter,
                //-------------login------------//
                isAuthenticated,
                signin, 
                loading,
                logout
            }}
        >
            {children}
        </UserContext.Provider>
    );
};