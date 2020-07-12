import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";

import Loading from "../loading/loading";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";

import "../../css/productGallery.css";

const ProductGallery = (props) => {
    
    //initializing query params
    const params = {
        gender: props.match.params.gender === "woman" ? (1) : (2),
        category: props.match.params.category,
        subcategory: props.match.params.hasOwnProperty("subcategory") ?
            (props.match.params.subcategory.replace(/_/g," ")) : (null)
    };

    //products state
    const [ products, setProducts ] = useState(null);

    //fetch products 
    const fetchProductGallery = async () => {
        const categoryString = JSON.stringify(params);
        const results = await fetch(`/api/products/gallery/${categoryString}`);
        const data = await results.json();
        setProducts(data);
        
        if(results.status !== 200) {
            props.history.push("/404");
        }
    };

    useEffect(() => {
        window.scrollTo(0,0);
        fetchProductGallery();
    }, [props.match.params.gender, props.match.params.category, props.match.params.subcategory]);


    //Page content
    const productType = params.subcategory ? (params.subcategory) : (params.category);
    const pageTitle = params.gender === 1 ? (`Women's ${productType}`) : (`Men's ${productType}`);


    return (
        <React.Fragment>
        <Navbar />
        <div className="product-gallery">
            <div className="container">
                <div className="title">
                    <h1>{pageTitle}</h1>
                </div>

                {
                    products ? (
                    <main className="gallery">
                        <ul className="product-grid">
                            {products.map(product => {
                                
                                let imgUrl = product.imageUrl.replace("public", "").trim();
                                let index = imgUrl.lastIndexOf(".");
                                imgUrl = imgUrl.substring(0, index)+"_m"+imgUrl.substring(index);

                                return (
                                    <li className="product-item" key={product.itemId} data-id={product.itemId}>
                                        <Link to={`/products/${product.itemId}`}>
                                        <div className="product-img">
                                            <img src={imgUrl} alt={product.name} />
                                        </div>
                                        <div className="product-name">{product.name}</div>
                                        <div className="product-price">{`$ ${product.price}`}</div>    
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </main>    
                    ) : (<Loading />)
                }
            </div>
        </div>
        <Footer />
        </React.Fragment>
    )
}

export default withRouter(ProductGallery);