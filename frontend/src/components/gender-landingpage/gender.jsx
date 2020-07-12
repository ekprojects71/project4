import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";

import "../../css/gender.css";


const GenderLandingPage = (props) => {

    const gender = props.match.params.gender;

    const [pageData, setPageData] = useState({});

    const bannerImg = gender === "woman" ? ("/images/promo/woman/woman-page-banner.jpg") : 
                                        ("/images/promo/man/man-page-banner.jpg");
    const featuredImg = gender === "woman" ? ("/images/promo/woman/woman-page-featured.jpg") : 
                                        ("/images/promo/man/man-page-featured.jpg");

    const fetchPageData = async () => {
        const results = await fetch(`/api/gender-page/${gender}`);
        const data = await results.json();
        setPageData(data);
    };

    useEffect(() => {
        window.scrollTo(0,0);
        fetchPageData();
        
    }, [props.match.params.gender]);

    return (
        <React.Fragment>
        <Navbar />
        <main className="gender-page">
            <div className="container">

                <div className="banner">
                    <h1>
                        {pageData.hasOwnProperty("banner") ? (pageData.banner.trim()) : 
                        (gender === "woman" ? ("Women's Fashion") : ("Men's Fashion"))}
                    </h1>
                    <div className="banner-img">
                        <img src={bannerImg} alt={`${gender}-banner`} />
                    </div>
                </div>

                <div className="featured">
                <Link to={pageData.hasOwnProperty("featured") ? (pageData.featured.link.trim().replace(/-/g, "_")) : 
                        (gender === "woman" ? ("/fashion/woman") : ("/fashion/man")) }>
                    <h1>
                        {pageData.hasOwnProperty("featured") ? (pageData.featured.title.trim()) : 
                        (gender === "woman" ? ("Explore Women's Fashion") : ("Explore Men's Fashion"))}
                    </h1>
                    <div className="featured-img">
                        <img src={featuredImg} alt={`${gender}-featured`} />
                    </div>
                </Link>   
                </div>

                <div className="popular-items">
                    {pageData.hasOwnProperty("popular") ? (
                        pageData.popular.map(section => {
                            return (
                                <div className="item" key={uuidv4()}>
                                <Link to={section.link.trim()}>
                                    <h1>{section.title.trim()}</h1>
                                    <div className="featured-img">
                                        <img src={section.img.trim()} alt={`${gender}-popular-item`} />
                                    </div>
                                </Link>   
                                </div>    
                            )
                        })
                    ) : ("")}
                </div>

            </div>
        </main>
        <Footer />
        </React.Fragment>
    )
}

export default GenderLandingPage;