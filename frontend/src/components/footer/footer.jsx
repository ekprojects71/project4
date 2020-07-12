import React from "react";
import { Link } from "react-router-dom";

import "../../css/footer.css";

const Footer = () => {

    return (
        <footer className="footer white">
            <div className="container">
                <div className="footer-links">
                    <div className="logo">
                        <Link to="/"><img src="/assets/company/logo.svg" alt="logo"/></Link> 
                    </div>
                    <div className="links">
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/fashion/woman">Women's Fashion</Link></li>
                            <li><Link to="/fashion/man">Men's Fashion</Link></li>
                            <li><Link to="/account/my-account">My Account</Link></li>
                            <li><Link to="/tos">Terms and Conditions</Link></li>
                        </ul>
                    </div>
                </div>
                
                <div className="project-stack">
                    Project Stack: Postgres, Node, Express & React
                </div>

                <div className="disclaimer">
                    This is not a real website and is not for commercial use. 
                    <em>This project and its contents are meant for demonstration purposes only. </em> 
                    None of the products listed are really for sale, no orders are actually placed. No ownership is claimed of any
                    of the products displayed in this demo.
                </div>    
            </div>
            
        </footer>
    )
}

export default Footer;