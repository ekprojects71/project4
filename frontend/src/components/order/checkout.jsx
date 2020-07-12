import React, { useContext, useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import Loading from "../loading/loading";

import { AuthContext } from "../../contexts/AuthContext";
import { ShoppingCartContext } from "../../contexts/ShoppingCartContext";

import "../../css/checkout.css";

const Checkout = (props) => {

    const { checkAuth } = useContext(AuthContext);

    const { cart, deleteUserCart } = useContext(ShoppingCartContext);

    const [ userInfo, setUserInfo ] = useState({});

    const fetchUserInfo = async () => {
        const response = await fetch("/api/user/user-info");
        const data = await response.json();
        console.log(data);
        if(response.status === 200) {
            setUserInfo({...data});
        }
    }

    const validateOnMount = async () => {
        let validated = await checkAuth();
        if(validated) {
            fetchUserInfo();  
        }
        else {
            props.history.push("/account/login");
        }
    } 

    useEffect(() => {
        if(cart.length === 0) {
            props.history.push("/");
        }

        validateOnMount();

    }, []);
    

    const deleteCart = async () => {
        let validated = await checkAuth();
        if(validated) {
            deleteUserCart();
        }
    }

    const sumbitOrder = async () => {
        const response = await fetch("/api/user/orders", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cart)
        });
        const data = await response.json();
        console.log(data);
        if(response.status === 200) {
            deleteCart(); 
        }
    };

    const computeTotal = () => {
        let total = 0;
        cart.forEach(product => {
            total += product.price * product.quantity;
        })

        return total.toFixed(2);
    }


    //handlers
    const handleCheckout = async () => {
        let validated = await checkAuth();
        if(!validated) {
            props.history.push("/account/login");
        }
        else {
            sumbitOrder();
            props.history.push("/account/my-account");
        }
    }

    
    return (
        <div className="checkout">

            <div className="container">

                <header className="cart-header">
                    <Link to="/">
                        <img src="/assets/company/logo.svg" alt="logo" />
                    </Link>
                    <p>Checkout</p>
                </header>
                
                {cart ? (<div>
                {cart.length > 0 ? ( 
                <main className="bag-content">
                    <ul className="bag-list">
                        {cart.map(product => {

                            return (
                                <li className="product" key={uuidv4()}>
                                    <div className="product-content">

                                        <div className="sm-screen-left">
                                            <div className="img">
                                                <Link to={`/products/${product.itemId}`}>
                                                    <img src={product.image} alt="thumbnail" />
                                                </Link>
                                            </div>    
                                        </div>

                                        <div className="sm-screen-right">
                                            <div className="name">
                                                <span>{product.name}</span>
                                            </div>
                                            <div className="size">
                                                {product.sizeName ? (
                                                    <span>Size: {product.sizeName}</span>    
                                                ) : (<span></span>)}
                                            </div>
                                            <div className="price">
                                                <span>{`$${(Math.round(product.price * product.quantity * 100) / 100).toFixed(2)}`}</span>
                                            </div>   
                                        </div>

                                    </div>
                                </li>
                            )

                        })}
                    </ul>

                    <div className="options-column">
                        <div className="edit-cart">
                            <Link to="/shopping-bag">Edit Bag</Link>
                        </div>

                        <div className="personal-info">
                            <h2>Shipping Info</h2>
                            <p className="note">Note: This componet is a stand-in</p>
                            { userInfo &&
                            <div className="shipping">
                                <p className="full-name">{userInfo.firstName} {userInfo.lastName}</p>
                                <p className="address">{userInfo.streetAddress}</p>
                                <p className="city-state-zip">{userInfo.city}, {userInfo.state} {userInfo.zipcode}</p>
                            </div>}
                        </div>

                        <div className="checkout">
                            <h2>Checkout</h2>
                            <div className="subtotal">
                                <span>Order total</span>
                                <span className="checkout-total">${computeTotal()}</span>
                            </div>
                            <div className="checkout-btn">
                                <button onClick={handleCheckout}>Place Order</button>
                            </div>
                        </div>    
                    </div>
                    
                    
                </main> ) : 
                (
                    <div className="empty-bag">
                        <p>Your shopping bag is empty.</p>
                        <Link to="/">Back to shopping</Link>
                    </div>
                )}
                </div>) : (<Loading />)}
            </div>
        </div>
    )
};

export default withRouter(Checkout);