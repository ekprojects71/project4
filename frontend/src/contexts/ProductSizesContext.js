import React, { createContext, useState, useEffect } from "react";

export const ProductSizesContext = createContext();

const ProductSizesContextProvider = (props) => {

    const [ productSizes, setProductSizes ] = useState(null);

    const fetchProductSizes = async () => {
        const response = await fetch("/api/products/sizes");
        const data = await response.json(); 
        setProductSizes(data);
    }

    useEffect(() => {
        if(!productSizes) {
            fetchProductSizes();
        }
    }, []);

    return (
        <ProductSizesContext.Provider value={{productSizes}}>
            { props.children }
        </ProductSizesContext.Provider>
    )
};

export default ProductSizesContextProvider;