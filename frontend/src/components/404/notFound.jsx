import React from "react";
import { Link } from "react-router-dom";

import "../../css/notFound.css";

const NotFound = () => {

    window.scrollTo(0,0);

    return (
        <div className="not-found">
            <div className="container">
                <h1>Our apologies, but we could not find that page.</h1>
                <Link to="/">Back to Shopping</Link>    
            </div> 
        </div>
    )
}

export default NotFound;