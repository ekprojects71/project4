import React, { createContext, useState, useEffect } from "react";

export const NavContext = createContext();

const NavContextProvider = (props) => {

    const [ navData, setNavData ] = useState(null);

    const fetchNavData = async () => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        const response = await fetch("/api/navbar", { signal: signal });
        const data = await response.json(); 
        setNavData(data);

        return function cleanup() {
            abortController.abort();
        }
    }

    

    useEffect(() => {
        if(!navData) {
            fetchNavData();
        }
    }, []);

    return (
        <NavContext.Provider value={{navData}}>
            { props.children }
        </NavContext.Provider>
    )
};

export default NavContextProvider;