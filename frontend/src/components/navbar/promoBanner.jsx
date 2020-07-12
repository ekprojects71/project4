import React, { useState, useEffect } from "react";


const PromoBanner = () => {

    const [ bannerData, setBannerData ] = useState({});

    const fetchBannerData = async () => {
        const results = await fetch("/api/promo");
        const data = await results.json();

        setBannerData(data);
    }

    useEffect(() => {
        if(Object.keys(bannerData).length === 0) {
            fetchBannerData();
        }
    });

    return (
        <div className="nav-promo-banner light-gray">
            <span>{bannerData.hasOwnProperty("promo") ? (bannerData.promo) : ("")}</span>  
        </div>
    )
}

export default PromoBanner;