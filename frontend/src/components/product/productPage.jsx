import React, { useState, useEffect, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { withRouter } from "react-router-dom";

import ProductFullscreen from "./productFullscreen";

import Loading from "../loading/loading";
import Footer from "../footer/footer";
import Navbar from "../navbar/navbar";

import { ShoppingCartContext } from "../../contexts/ShoppingCartContext";

import "../../css/productPage.css";


const ProductPage = (props) => {
    
    const { addProduct } = useContext(ShoppingCartContext);

    //product state
    const [ product, setProduct ] = useState(null);

    //for storing the size
    const [ selection, setSelection ] = useState(null);

    //for validation
    const [ validSelection, setValidSelection ] = useState(true); 

    //fetch the product
    const fetchProduct = async () => {
        const gender = props.match.params.gender;
        const category = props.match.params.category;
        const subcategory = props.match.params.subcategory;
        const title = props.match.params.title;
        const response = await fetch(`/api/products/product/${gender}/${category}/${subcategory}/${title}`);
        const data = await response.json();
        
        if(response.status === 200) {
            setProduct(data);    
        }
        if(response.status !== 200) {
            props.history.push("/404");
        }
    };

    useEffect(() => {
        if(!product) {
            fetchProduct();
        }
        
    }, [props.match.params.product_code, selection, validSelection]);


    //calculate savings - if product is on sale
    const calcSavings = () => {
        return Math.trunc((product.price - product.salePrice) / product.price);
    }

    //sets the active image, the image to view in fullscreen
    const [ activeImg, setActiveImg ] = useState(null);

    const setFullscreenImage = (img) => {
        setActiveImg(img);
    };

    //handlers

    //handle image click, opens fullscreen modal
    const handleImage = (e) => {
        const img = e.target.getAttribute("data-id").replace("public", "").trim();
        setFullscreenImage(img);
    };

    //handle size selection
    const handleSize = (e) => {
        let name = "";
        let value = e.target.value;
        if(value) {
            product.sizes.forEach(size => {
                if(size.size_number === value) { name=size.size_value; }
            });
        }
        
        setSelection({value: value, name: name });
        console.log(value);
    }

    //handle submit (add product to cart)
    const handleSubmit = (e) => {
        e.preventDefault();

        let value = null;
        let name = "";

        if(selection) {
            name = selection.name;
            value = selection.value;
        }
        

        let imgUrl = product.images[0].image_url.replace("public", "").trim();
        let index = imgUrl.lastIndexOf(".");
        imgUrl = imgUrl.substring(0, index)+"_s"+imgUrl.substring(index);

        let found = false; 
        if(product.sizes.length > 0) {
            
           product.sizes.forEach(size => {
                if(size.size_number === value) { found = true; }
            });
            setValidSelection(found);
        }

        if(found || product.sizes.length === 0) {
            let price = 0;
            if(product.onSale) {
                price = product.salePrice;
            }
            else {
                price = product.price;
            }

            addProduct(product.itemId, value, product.name, name, price, imgUrl);
        }
    }


    return (
        <React.Fragment>
        <Navbar />
        <div className="product-page">
        {product ? (    
            <div className={`container ${activeImg ? ("hidden") : ("")}`}>

                {/* Product Menu */}
                <main className="product-menu">
                    
                    <div className="name">
                        <h1>{product.name}</h1>
                    </div>
                    <div className="price">
                        {product.onSale ? 
                            (
                                <div className="sale">
                                    <div className="prices">
                                        <span className="normal-price slashed">{`$${product.price}`}</span>
                                        <span className="sale-price">{`$${product.salePrice}`}</span>
                                    </div>
                                    <div className="savings">
                                        <span>You save {calcSavings()}%</span>
                                    </div>    
                                </div>
                                
                            ) 
                            : (<div className="sale"><span className="normal-price">{`$${product.price}`}</span></div>)}
                    </div>
                    
                    
                    <div className="description">
                        <span>{product.description}</span>
                    </div>
                    
                    <form className="product-form" onSubmit={handleSubmit} >
                        {product.sizes.length > 0 ? (
                            <div className="sizes">
                                <h3 className="label">Size</h3>
                                <div className="size-options">
                                {product.sizes.map(size => {
                                    return (
                                        <div className="size-option" 
                                            key={size.size_number}
                                            data-id={size.size_number}
                                        >
                                            <input type="radio" id={size.size_value} name="size" 
                                                value={size.size_number} onChange={handleSize} />
                                            <label htmlFor={size.size_value}>{size.size_value}</label>    
                                        </div>
                                    )
                                    
                                })}
                                </div>    
                            </div> 
                        ) : ("")}

                        {!validSelection && 
                        <div className="validate">
                            <p>Please pick a size first</p>
                        </div>
                        }
                        
                        <div className="submit">
                            <input type="submit" value="add to bag" />       
                        </div>
                    </form>
                    
                    

                    <div className="details">
                        <h3>Details</h3>
                        <ul>
                            {product.details.map(detail => {
                                return (
                                    <li key={uuidv4()}>{detail.detail_info}</li>
                                )
                            })}    
                        </ul>    
                    </div>
                </main>
                
                {/* Image Gallery */}
                <div className="img-gallery">
                    {product.images.map(image => {
                        let imgUrl = image.image_url.replace("public", "").trim();
                        let index = imgUrl.lastIndexOf(".");
                        imgUrl = imgUrl.substring(0, index)+"_m"+imgUrl.substring(index);
                        return (
                            <div key={uuidv4()} className="img-item">
                                <img src={imgUrl} alt={product.name} 
                                    key={uuidv4()} data-id={image.image_url} onClick={handleImage} 
                                />
                            </div>    
                        )
                    })}
                </div>    
            </div>
        ) : (<Loading />)}

        {/* Image fullscreen preview */}
        {activeImg && 
            <ProductFullscreen  
                setFullscreenImage={setFullscreenImage}
                imgUrl={activeImg}
            />}    

        </div>
        <Footer />
        </React.Fragment>
    )
}

export default withRouter(ProductPage);