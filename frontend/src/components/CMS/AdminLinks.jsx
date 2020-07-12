import React from "react";
import { Link } from "react-router-dom";

import "../../css/admin-nav.css";

const AdminLinks = () => {

    return (
        <div className="admin-links">
            <ul>
                <li><Link to="/cms">CMS Home</Link></li>
                <li><Link to="/cms/products">Products</Link></li>
            </ul>
        </div>    
    )
    
}

export default AdminLinks;