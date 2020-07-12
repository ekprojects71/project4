import React, { useContext, useEffect, useState } from "react";
import { withRouter, Link } from "react-router-dom";

import OrderItem from "./orderItem";
import Loading from "../loading/loading";

import { AuthContext } from "../../contexts/AuthContext";
import { ShoppingCartContext } from "../../contexts/ShoppingCartContext";

import "../../css/myAccount.css";

const MyAccount = (props) => {

    //auth context for guarding the route
    const { checkAuth } = useContext(AuthContext);

    const { getUserCart } = useContext(ShoppingCartContext);

    //redirect to login page, if not logged in
    const validateOnMount = async () => {
        const validated = await checkAuth();
        if(!validated) {
            props.history.push("/account/login");
        }
        else {
            fetchOrders();
            fetchUserInfo();
            getUserCart();
        }
    };

    //dashboard data
    const [ orders, setOrders ] = useState([]);
    const [ userInfo, setUserInfo ] = useState({});

    //fetch user orders
    const fetchOrders = async () => {
        const response = await fetch("/api/user/orders");
        const data = await response.json();
        
        if(response.status === 200) {
            setOrders([...data]);
        }
    };

    //fetch user info
    const fetchUserInfo = async () => {
        const response = await fetch("/api/user/user-info");
        const data = await response.json();
        
        if(response.status === 200) {
            setUserInfo({...data});
        }
    }

    //runs on mount, checks if user is authenticated
    useEffect(() => {
        validateOnMount();
    }, []);


    //logout
    const logout = async () => {
        const response = await fetch("/auth/logout", {method: "POST"});
        if(response.status === 200) {
            props.history.push("/");
        }
    };

    //handlers
    const handleLogout = () => {
        logout();
    };
    
    return (
        <div className="my-account">
            
            {userInfo && 

            <div className="container">
                <header className="myaccount-header">
                    <Link to="/">
                        <img src="/assets/company/logo.svg" alt="logo" />
                    </Link>
                    <p>Your Account</p>
                </header>

                {orders && Object.keys(userInfo).length > 0 ? (<div>
                <main className="user-dash">

                    {userInfo.isAdmin && 
                        <div className="cms-access">
                            <Link to="/cms">Click here for CMS access</Link>
                        </div>
                    }
                    
                    <div className="logout">
                        <button onClick={handleLogout}>Log Out</button>
                    </div>

                    <div className="user-info">
                        <h2>Customer</h2>
                        <p>{`${userInfo.firstName} ${userInfo.lastName}`}</p>
                        <p>{`${userInfo.streetAddress}`}</p>
                        <p>{`${userInfo.city}, ${userInfo.state} ${userInfo.zipcode}`}</p>
                    </div>

                    <div className="orders-total">
                        <h2>Orders Summary</h2>
                        <p>There are {orders.length} orders on record.</p>
                    </div>

                    <div className="orders">
                        {orders.length > 0 ? (

                            <ul className="orders-list">
                                {orders.map(order => {
                                    return (
                                        <li key={order.orderNumber} className="order-details">
                                            <OrderItem order={order} />
                                        </li>
                                    )
                                })}
                            </ul>

                        ) : (<div className="no-orders">You have not placed any orders.</div>)}
                    </div>
                    
                </main>
                
                </div>) : (<Loading />)}
            </div>

            }
        </div>
    )
};

export default withRouter(MyAccount);