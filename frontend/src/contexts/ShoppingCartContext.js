import React, { createContext, useState } from "react";

export const ShoppingCartContext = createContext();

const ShoppingCartProvider = (props) => {

    if(localStorage.getItem("cart") === null) {
        localStorage.setItem("cart", JSON.stringify([]));
    }

    const [ cart, setCart ] = useState(JSON.parse(localStorage.getItem("cart")) || []);

    const updateStoredCart = (cart) => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    const addProduct = (itemId, sizeId, name, sizeName, price, image) => {

        let storedCart = JSON.parse(localStorage.getItem("cart"));

        const found = storedCart.findIndex(product => {
            return product.itemId === itemId && product.sizeId === sizeId
        });

        if(found !== -1) {
            let newCart = [...storedCart];
            newCart[found].quantity++;
            
            storedCart = newCart;
        }
        else {
            storedCart = [...storedCart, { 
                itemId: itemId, 
                sizeId: sizeId ? (sizeId) : (null),
                identifier: sizeId ? (itemId + sizeId) : (itemId),
                name: name,
                sizeName: sizeName ? (sizeName) : (""),
                price: price, 
                image: image, 
                quantity: 1 }];
        }

        updateStoredCart(storedCart);
        setCart([...storedCart]);
    };

    const removeProduct = (identifier) => {
        let storedCart = JSON.parse(localStorage.getItem("cart"));
        const newCart = storedCart.filter(product => {
            return product.identifier != identifier
        });
        storedCart = newCart;
        
        setCart([...storedCart]);

        updateStoredCart(storedCart);
    };

    const changeQuantity = (identifier, quantity) => {
        let storedCart = JSON.parse(localStorage.getItem("cart"));
        const found = storedCart.findIndex(product => {
            return product.identifier === identifier
        });

        if(found !== -1) {
            let newCart = [...storedCart];
            newCart[found].quantity = quantity;
            storedCart = newCart;
        }

        setCart([...storedCart]);
        updateStoredCart(storedCart);
    };

    const saveUserCart = async () => {
        let storedCart = JSON.parse(localStorage.getItem("cart"));
        const response = await fetch("/api/shopping-cart", {
                            method: "POST",
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(storedCart)
                        });
        const data = await response.json();
        if(response.status === 200) {
            setCart([...data]);
            updateStoredCart(data);
        }
        
    };

    const deleteUserCart = async () => {
        //delete the cart in the DB and local storage (if successfuly request)
        const response = await fetch("/api/shopping-cart", { method: "DELETE" });
        if(response.status === 200) {
            setCart([]);
            updateStoredCart([]);
        }
    };

    const getUserCart = async () => {
        const response = await fetch("/api/shopping-cart");
        const data = await response.json();

        if(response.status === 200) {
            if(data.length > 0) {
                setCart([...data]);
                updateStoredCart(data);
            }
        }
    }
        
    return (
        //export the Provider object of the AuthContext context (not the class itself) 
        <ShoppingCartContext.Provider value={{ cart:cart, addProduct, removeProduct, changeQuantity, 
                                        saveUserCart, deleteUserCart, getUserCart }}>
            {props.children}
        </ShoppingCartContext.Provider>
    )

}

export default ShoppingCartProvider;