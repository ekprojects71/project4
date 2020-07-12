import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ShoppingCartContext } from "../../contexts/ShoppingCartContext";


const NavBag = () => {

    const { cart } = useContext(ShoppingCartContext);

    return (
        <div className="nav-bag">
            <Link to="/shopping-bag">
                <img src="/assets/icons/shopping-bag.svg" alt="my-acct-icon" />
                <div className="nav-shopping-qty"><span>{cart.length}</span></div>
            </Link>
        </div>
    )
}

export default NavBag;