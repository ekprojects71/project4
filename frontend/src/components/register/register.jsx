import React, { useState, useEffect, useContext } from "react";
import { Link, withRouter } from "react-router-dom";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

import { AuthContext } from "../../contexts/AuthContext";

import StatesDropdown from "./statesDropdown";

import "../../css/registerPage.css";


const Register = (props) => {

    const { register, handleSubmit, reset } = useForm();

    const [errors, setErrors] = useState([]);

    //stores the value of the state dropdown
    const [ stateUSA, setStateUSA ] = useState("");

    //auth context for guarding the route
    const { checkAuth } = useContext(AuthContext);

    //redirect to my-account on register, or if already logged in
    const redirectToDashboard = async () => {
        const validated = await checkAuth();
        if(validated) {
            props.history.push("/account/my-account");
        }
    };

    //runs on mount, checks if user is authenticated
    useEffect(() => {
        redirectToDashboard();
    }, []);

    //register account
    const registerAccount = async (account) => {
        const response = await fetch("/auth/register", {
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
            
            setErrors(["Account Successfully Created! You will be redirected shortly."]);
            props.history.push("/account/my-account");
            window.scrollTo(0,0);
        }
    };

    //handle form submit
    const onSubmit = (data, e) => {
        e.preventDefault();

        const userData = {...data, state: stateUSA};

        window.scrollTo(0,0);
        registerAccount(userData);
    };



    return (
        <div className="register-page">
            <div className="container">

                <header className="register-header">
                    <Link to="/">
                        <img src="/assets/company/logo.svg" alt="logo" />
                    </Link>
                    <p>Your Account</p>
                </header>

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
                
                <form className="registration-form" onSubmit={handleSubmit(onSubmit)}>

                    <div className="form-header">
                        <h1>Register</h1>
                        <p><Link to="/account/login">Already registered? Click here.</Link></p>
                        <p className="directions">
                            If you wish to test this registration page, please DO NOT enter any sensitive information, 
                            such as your real name & address or a password, email, etc. that you actually use. The server 
                            will delete any account you register the next time it spins up.
                        </p>    
                    </div>

                    <div className="credentials">
                        <h2>Your Credentials</h2>

                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" name="email" required 
                                ref={register} />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <p className="directions">
                                Your password must have at least 8 characters containing letters with no spaces, 
                                at least one number, an uppercase letter and a special character.
                            </p>
                            <input type="password" id="password" name="password" required 
                                ref={register} />
                        </div>
                    </div>

                    <div className="personal-info">
                        <h2>Your Personal Information</h2>

                        <div className="input-group">
                            <label htmlFor="firstName">First Name</label>
                            <input type="text" id="firstName" name="firstName" required 
                                ref={register} />
                        </div>
                        <div className="input-group">
                            <label htmlFor="lastName">Last Name</label>
                            <input type="text" id="lastName" name="lastName" required 
                                ref={register} />
                        </div>
                        <div className="input-group">
                            <label htmlFor="streetAddress">Street Address</label>
                            <input type="text" id="streetAddress" name="streetAddress" required 
                                ref={register} />
                        </div>
                        <div className="input-group">
                            <label htmlFor="city">City</label>
                            <input type="text" id="city" name="city" required 
                                ref={register} />
                        </div>
                        <div className="input-group">
                            <label htmlFor="state">State</label>
                            <StatesDropdown id="state" name="state" required 
                                setStateUSA={setStateUSA} />
                        </div>
                        <div className="input-group">
                            <label htmlFor="zipcode">Zipcode</label>
                            <input type="number" id="zipcode" name="zipcode" min="10000" max="99999" required 
                                ref={register} />
                        </div>
                    </div>

                    <div className="submission">
                        <div className="terms">
                            <p>
                                By clicking on “Create my account” you confirm you have read the privacy 
                                policy and consent to the processing of your personal data by Desert Shore 
                                for the management of your account in the conditions set forth in the 
                                Terms and Conditions available in the footer.
                            </p>
                            <p>
                                As per applicable laws and regulations, you are entitled to access, correct 
                                and delete any data that may relate to you. You may also ask us not to send you 
                                personalized communications on our products and services.
                                You may exercise these right at any time directly in the menu “My Account”.
                            </p>
                        </div>
                        <div className="submit-btn">
                            <input type="submit" value="Create My Account" />
                        </div>
                    </div>
                </form>
                
            </div>
        </div>
    )
};

export default withRouter(Register);