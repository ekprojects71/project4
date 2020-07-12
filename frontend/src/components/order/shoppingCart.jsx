import React, { useContext, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import Loading from "../loading/loading";

import { AuthContext } from "../../contexts/AuthContext";
import { ShoppingCartContext } from "../../contexts/ShoppingCartContext";

import "../../css/shoppingCart.css";

const ShoppingCart = (props) => {

    const { checkAuth } = useContext(AuthContext);

    const { cart, removeProduct, changeQuantity, saveUserCart } = useContext(ShoppingCartContext);
    
    const saveCart = async () => {
        let validated = await checkAuth();
        if(validated) {
            saveUserCart();
        }
    }

    useEffect(() => {
        saveCart();
    }, []);


    const computeTotal = () => {
        let total = 0;
        cart.forEach(product => {
            total += product.price * product.quantity;
        })

        return total.toFixed(2);
    }


    //handlers
    const handleRemove = (e) => {
        const identifier = e.target.getAttribute("data-id");
        const found = cart.find(product => {
            return product.identifier === identifier
        });

        if(found !== -1) {
            removeProduct(identifier);
        }
    }
    const increaseQty = (e) => {
        const identifier = e.target.getAttribute("data-id");

        const found = cart.find(product => {
            return product.identifier === identifier
        });

        if(found !== -1) {
            let quantity = found.quantity + 1;
            if(quantity < 1){
                quantity = 1;
            }
            else if(quantity > 10) {
                quantity = 10;
            }

            changeQuantity(identifier, quantity);
        }
    }
    const decreaseQty = (e) => {
        const identifier = e.target.getAttribute("data-id");

        const found = cart.find(product => {
            return product.identifier === identifier
        });

        if(found !== -1) {
            let quantity = found.quantity - 1;
            if(quantity < 1){
                quantity = 1;
            }
            else if(quantity > 10) {
                quantity = 10;
            }

            changeQuantity(identifier, quantity);
        }
    }

    /* *checkout handler* */
    const handleCheckout = async () => {
        let validated = await checkAuth();
        if(!validated) {
            props.history.push("/account/login");
        }
        else {
            props.history.push("/checkout");
        }
    }

    
    return (
        <div className="shopping-cart">

            <div className="container">

                <header className="cart-header">
                    <Link to="/">
                        <img src="/assets/company/logo.svg" alt="logo" />
                    </Link>
                    <p>Shopping Bag</p>
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
                                            <div className="quantity">
                                                <button className="qty-toggle" data-id={product.identifier}
                                                    onClick={increaseQty} >+</button>
                                                <button className="qty-toggle" data-id={product.identifier}
                                                    onClick={decreaseQty} >-</button>

                                                <div className="qty-display">
                                                    <span>{product.quantity}</span>
                                                </div>
                                            </div>
                                            <div className="price">
                                                <span>{`$${(Math.round(product.price * product.quantity * 100) / 100).toFixed(2)}`}</span>
                                            </div>
                                            <div className="remove">
                                                <button data-id={product.identifier} 
                                                    onClick={handleRemove}>Remove</button>
                                            </div>    
                                        </div>

                                    </div>
                                </li>
                            )

                        })}
                    </ul>

                    <div className="checkout">
                        <h2>Your Shopping Bag</h2>
                        <div className="subtotal">
                            <span>subtotal</span>
                            <span className="checkout-total">${computeTotal()}</span>
                        </div>
                        <div className="checkout-btn">
                            <button onClick={handleCheckout}>Checkout</button>
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

export default withRouter(ShoppingCart);