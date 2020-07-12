import React, { useState, useContext, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

import Loading from "../loading/loading";

import { AuthContext } from "../../contexts/AuthContext";
import { ShoppingCartContext } from "../../contexts/ShoppingCartContext";

import "../../css/login.css"

const Login = (props) => {

    const { getUserCart } = useContext(ShoppingCartContext);

    const { register, handleSubmit, reset } = useForm();

    const [ errors, setErrors ] = useState([]);
    
    const [loading, setLoading] = useState(true);

    //auth context for guarding the route
    const { checkAuth } = useContext(AuthContext);

    //redirect to my-account on login, or if already logged in
    const redirectToDashboard = async () => {
        const validated = await checkAuth();
        if(validated) {
            props.history.push("/account/my-account");
        }
    };

    //runs on mount, checks if user is authenticated
    useEffect(() => {
        redirectToDashboard();
        setLoading(false);
    }, []);

    //login to account
    const login = async (account) => {
        const response = await fetch("/auth/login", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(account)
                        });
        const data = await response.json();

        if(response.status !== 200 &&
            response.status !== 403 ) {
            setErrors([...data.errors]);
        }
        else if(response.status === 403) {
            redirectToDashboard();
        }
        else {
            reset();
            getUserCart();  //get the user's shopping cart on login
            redirectToDashboard();    
        }
    };

    //handle form submit
    const onSubmit = (data, e) => {
        e.preventDefault();

        window.scrollTo(0,0);
        login(data);
    };


    return (
        <div className="login-page">
            <div className="container">

                <header className="login-header">
                    <Link to="/">
                        <img src="/assets/company/logo.svg" alt="logo" />
                    </Link>
                    <p>Your Account</p>
                </header>

                {!loading ? (<div>

                
                {errors.length > 0 &&
                    <div className="messages">
                        <ul>
                            {errors.map(error => {
                                return (
                                    <li key={uuidv4()}>{error}</li>
                                )
                            })}
                        </ul>
                    </div>
                }

                <div className="login-menu">
                    <div className="register">
                        <h1>Register</h1>
                        <p>
                            Create an account to manage your orders and view all your personal information.
                        </p>
                        <div className="register-btn">
                            <Link to="/account/register">
                                <button>Create An Account</button>
                            </Link>
                        </div>
                    </div>

                    <div className="login">
                        <h1>Log In</h1>
                        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                            <div className="input-group">
                                <label htmlFor="email">Email Address</label>
                                <input type="email" name="email" id="email" required 
                                    ref={register} />    
                            </div>
                            <div className="input-group">
                                <label htmlFor="password">Password</label>
                                <input type="password" name="password" id="password" required 
                                    ref={register} />
                            </div>
                            
                            <div className="login-btn">
                                <input type="submit" value="Log In" />
                            </div>
                        </form>
                    </div>
                </div>

            </div>) : (<Loading />)}
            
            </div>
        </div>
    )
};

export default withRouter(Login);