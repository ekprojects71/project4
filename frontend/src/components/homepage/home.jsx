import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "../../css/home.css";

const Home = () => {

    const [homepageData, setHomepageData] = useState({});

    const fetchHomepageData = async () => {
        const results = await fetch("/api/homepage");
        const data = await results.json();
        setHomepageData(data);
    };

    useEffect(() => {
        window.scrollTo(0,0);
        if(Object.keys(homepageData).length === 0) {
            fetchHomepageData();
        }
    }, []);

    return (
        <main className="homepage">
            <div className="container">

                <div className="jumbotron">
                    <div className="jumbo-img"></div>
                    <div className="jumbo-btm">
                        <div className="jumbo-title">
                            {homepageData.hasOwnProperty("title") ? 
                            (homepageData.title) : ("Explore the collection")}
                        </div>
                        <div className="jumbo-btns">
                            <Link to="/fashion/woman">
                                <button className="jumbo-woman">Shop Women's</button>
                            </Link>
                        
                            <Link to="/fashion/man">
                                <button className="jumbo-man">Shop Men's</button>
                            </Link>
                        </div>  
                    </div>
                </div>

                <section className="fashion-categories">
                    <div className="gender-title">
                        <h1>Women's Fashion</h1>
                    </div>
                    <div className="categories-gallery">
                        <div className="category-item">
                            <Link to="/fashion/woman/clothing">
                                <div className="img-wrapper">
                                    <img src="/images/promo/woman/hp-clothing-woman.jpg" alt="womens-clothing" /> 
                                </div>
                                <h3>Clothing</h3>
                            </Link>
                        </div>
                        <div className="category-item">
                            <Link to="/fashion/woman/shoes">
                                <div className="img-wrapper">
                                    <img src="/images/promo/woman/hp-shoes-woman.jpg" alt="womens-shoes" /> 
                                </div>
                                <h3>Shoes</h3>
                            </Link>
                        </div>
                        <div className="category-item">
                            <Link to="/fashion/woman/accessories">
                                <div className="img-wrapper">
                                    <img src="/images/promo/woman/hp-accessories-woman.jpg" alt="womens-accessories" /> 
                                </div>
                                <h3>Accessories</h3>
                            </Link>
                        </div>
                        <div className="category-item">
                            <Link to="/fashion/woman/fragrance">
                                <div className="img-wrapper">
                                    <img src="/images/promo/woman/hp-fragrance-woman.jpg" alt="womens-fragrance" /> 
                                </div>
                                <h3>Fragrance</h3>
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="fashion-categories">
                    <div className="gender-title">
                        <h1>Men's Fashion</h1>
                    </div>
                    <div className="categories-gallery">
                        <div className="category-item">
                            <Link to="/fashion/man/clothing">
                                <div className="img-wrapper">
                                    <img src="/images/promo/man/hp-clothing-man.jpg" alt="mens-clothing" />
                                </div>
                                <h3>Clothing</h3>
                            </Link>
                        </div>
                        <div className="category-item">
                            <Link to="/fashion/man/shoes">
                                <div className="img-wrapper">
                                    <img src="/images/promo/man/hp-shoes-man.jpg" alt="mens-shoes" />
                                </div>
                                <h3>Shoes</h3>
                            </Link>
                        </div>
                        <div className="category-item">
                            <Link to="/fashion/man/accessories">
                                <div className="img-wrapper">
                                    <img src="/images/promo/man/hp-accessories-man.jpg" alt="mens-accessories" /> 
                                </div>
                                <h3>Accessories</h3>
                            </Link>
                        </div>
                        <div className="category-item">
                            <Link to="/fashion/man/fragrance">
                                <div className="img-wrapper">
                                <img src="/images/promo/man/hp-fragrance-man.jpg" alt="mens-fragrance" /> 
                                </div>
                                <h3>Fragrance</h3>
                            </Link>
                        </div>
                    </div>
                </section>
            </div> 
        </main>
    )
}

export default Home;