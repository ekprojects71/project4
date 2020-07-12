import React, { useState } from "react";

//sub-components
import PromoBanner from "./promoBanner";
import NavbarLG from "./navbar-lg";
import NavbarSM from "./navbar-sm";

//styles
import "../../css/colors.css";
import "../../css/navbar.css";


const Navbar = () => {

    //keeps track of viewport width, initializes screen width on render
    const [viewport, setViewport] = useState(window.innerWidth);

    //draws the appropriate navbar based on the viewport width
    const drawNavbar = viewport < 1366 ? (
            //small screens
            <NavbarSM />
        ) :
        (
            //large screens
            <NavbarLG />
        );

    
    //event listener that updates the viewport state
    window.addEventListener("resize", () => {
        setViewport(window.innerWidth);
    });

    
    return (
        <header className="navbar pure-white">
            <PromoBanner />
            <div className="container">
                {drawNavbar}
            </div>
        </header>
    )
}

export default Navbar;