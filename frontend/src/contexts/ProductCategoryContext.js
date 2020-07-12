import React, { createContext, useState, useEffect } from "react";

export const ProductCategoryContext = createContext();

const ProductCategoryContextProvider = (props) => {

    const [ productCategories, setProductCategories ] = useState(null);

    const fetchProductCategories = async () => {
        const response = await fetch("/api/products/subcategories");
        const data = await response.json(); 
        setProductCategories(data);
    }

    useEffect(() => {
        if(!productCategories) {
            fetchProductCategories();
        }
    }, []);

    return (
        <ProductCategoryContext.Provider value={{productCategories}}>
            { props.children }
        </ProductCategoryContext.Provider>
    )
};

export default ProductCategoryContextProvider;