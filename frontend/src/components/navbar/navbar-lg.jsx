import React, { useState } from "react";
import { Link } from "react-router-dom";

import NavBag from "./navBag";
import ProdMenuLG from "./prodMenu-lg";

const NavbarLG = () => {

    const [hoveredTab, setHoveredTab] = useState("");

    //event handlers
    const showProdMenu = (e) => {
        if(e.target.innerText === "WOMAN") {
            setHoveredTab("WOMAN");
        }
        else if (e.target.innerText === "MAN") {
            setHoveredTab("MAN");
        }
    };

    const hideProdMenu = (e) => {
        setHoveredTab("");
    }

    return (
        <div className="nav-lg">
            <div className="top">
                <div className="top-left"></div>
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
            <nav className="bottom">
                <ul className="nav-btm-tabs">
                    <li className="nav-btm-tab" key={"WOMAN"} aria-label="WOMAN" 
                         onMouseLeave={hideProdMenu}>

                        <Link to="/fashion/woman" className={`nav-tab-link ${hoveredTab === "WOMAN" ? "nav-tab-hovered" : ""}`}
                                    onMouseEnter={showProdMenu}>WOMAN</Link>
                        
                        {hoveredTab === "WOMAN" && <ProdMenuLG gender={0} />}
                    </li>
                    <li className="nav-btm-tab" key={"MAN"} aria-label="MAN" 
                         onMouseLeave={hideProdMenu}>

                        <Link to="/fashion/man" className={`nav-tab-link ${hoveredTab === "MAN" ? "nav-tab-hovered" : ""}`}
                                    onMouseEnter={showProdMenu}>MAN</Link>
                        
                        {hoveredTab === "MAN" && <ProdMenuLG gender={1} />}
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default NavbarLG;