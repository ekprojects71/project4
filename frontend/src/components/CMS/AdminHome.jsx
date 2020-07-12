import React, { useEffect, useContext } from "react";
import { Link, withRouter } from "react-router-dom";

import { AuthContext } from "../../contexts/AuthContext";

import AdminLinks from "./AdminLinks";

import "../../css/adminHome.css";

const AdminHome = (props) => {

    //auth context for guarding the route
    const { authenticated, checkAuth } = useContext(AuthContext);

    //redirect to my-account on register, or if already logged in
    const validateOnMount = async () => {
        if(!authenticated) {
            props.history.push("/account/login");
        }
        const validated = await checkAuth();
        if(!validated) {
            props.history.push("/account/login");
        }
    };

    useEffect(() => {
        validateOnMount();
    }, []);

    return (
        <div className="admin-home">
            <div className="container">
                <header className="admin-header">
                    <Link to="/">
                        <img src="/assets/company/logo.svg" alt="logo" />
                    </Link>
                    <p>Content Management</p>
                </header>
                <AdminLinks />

                <div className="information">
                    <h1>Welcome</h1>
                    <h2>UNDER CONSTRUCTION</h2>
                    <p>
                        This section is under construction. At present, you may manage products by clicking on the prodcuts link.
                        That page will allow you to add a new product, as well as view and edit existing products. 
                    </p>
                    <p>
                        For the best possible experience, it is advised that you test this section on a desktop.
                    </p>
                    <img src="/assets/company/under-construction.jpg" alt="under-construction" />
                </div>

            </div>
        </div>
    )
}

export default withRouter(AdminHome);