import React, { createContext, useState } from "react";

export const AuthContext = createContext();

const AuthContextProvider = (props) => {
    
    const [authenticated, setAuthenticated] = useState(false);

    const checkAuth = async () => {
        let loggedIn = false;

        const response = await fetch("/auth/validate");
        const data = await response.json();

        if(data.status) {
            loggedIn = true;
        }

        setAuthenticated(loggedIn);

        return loggedIn;
    };
        
    return (
        //export the Provider object of the AuthContext context (not the class itself) 
        <AuthContext.Provider value={{ authenticated, checkAuth }}>
            {props.children}
        </AuthContext.Provider>
    )

}

export default AuthContextProvider;