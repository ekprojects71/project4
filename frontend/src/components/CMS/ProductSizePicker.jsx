import React, { useState, useContext } from "react";
import { ProductSizesContext } from "../../contexts/ProductSizesContext";

import "../../css/prod-size-picker.css";

//this component should take 3 props:
//1) activeSizes - an array of sizes (size-numbers which should be the data-id value)
//2) addSize - a function that adds a size to the parent's size state
//2) removeSize - a function that removes a size to the parent's size state

const ProductSizePicker = (props) => {

    const [ activeSizes, setActiveSizes ] = useState(props.activeSizes || []);

    const { productSizes } = useContext(ProductSizesContext);

    const handleSelection = (e) => {
        e.target.classList.toggle("selected");
        const newSize = e.target.getAttribute("data-id");

        if(e.target.classList.contains("selected")) {
            props.addSize(newSize);
        }
        else {
            props.removeSize(newSize);
        }
    }

    return (
        <div className="product-size-picker">
            {activeSizes ? (
                
                <ul className="sizes-container">
                    { productSizes ? (
                        productSizes.map(size => {
                            let active = props.activeSizes.includes(size.size_number);

                            return(
                                <li className={`size-item ${active ? "selected":""}`} key={size.size_number} data-id={size.size_number}
                                onClick={handleSelection}>
                                    {size.size_value}                 
                                </li>
                            )
                        })
                    ) : ("")}
                </ul>

            ): ("Just a moment...")}
            
        </div>
    )

}

export default ProductSizePicker;