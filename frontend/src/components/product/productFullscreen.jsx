import React from "react";

import "../../css/productPage.css";

//takes 2 props
// 1.) setFullScreenImg = when x button is clicked, sets image to null closes the modal
// 2.) imgUrl - this prop is passed into the src attribute

const ProductFullscreen = (props) => {

    return (
        <div className="product-fullscreen">

            {/* close button - floats above the image */}
            <div className="close">
                <button onClick={() => props.setFullscreenImage(null)} 
                    ><img src="/assets/icons/x-icon.svg" alt="close-menu"/></button>
            </div>

            <div className="image">
                <img src={props.imgUrl} alt="fullscreen-preview" />
            </div>
        </div>
    )
};

export default ProductFullscreen;