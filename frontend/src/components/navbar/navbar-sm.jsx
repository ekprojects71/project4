import React, { useState } from "react";
import { Link } from "react-router-dom";

import NavBag from "./navBag";
import ProdMenuSM from "./prodMenu-sm";

const NavbarSM = () => {

    const [menuToggled, setMenuToggled] = useState(false);

    //event handlers
    const openHamMenu = (e) => {
        setMenuToggled(true);
    }

    return (
        <div className="nav-sm">
            <div className="top">
                <div className="top-left">
                    <div className="hamburger" onClick={openHamMenu}>
                        <img src="/assets/icons/hamburger-icon.svg" alt="toggle-hamburger-menu" />
                    </div>
                </div>
                <div className="logo-center">
                    <Link to="/"><img src="/assets/company/logo.svg" alt="logo"/></Link>
                </div>
                <div className="top-right">
                    <div className="nav-profile">
                        <Link to="/account/login"><img src="/assets/icons/profile-icon.svg" alt="my-acct-icon" /></Link>
                    </div>
                    <NavBag />
                </div>
            </div>
            {menuToggled && <ProdMenuSM setMenuToggled={setMenuToggled}/>}
        </div>
    )
}

export default NavbarSM;