import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

//contexts
import { NavContext } from "../../contexts/NavContext";

const ProdMenuLG = (props) => {

    const { navData } = useContext(NavContext);
    const menuTitle = props.gender === 0 ? ("Women's Fashion") : ("Men's Fashion");
    const fragranceImg = props.gender === 0 ? ("/images/promo/woman/nav-fragrance-woman.jpg") : ("/images/promo/man/nav-fragrance-man.jpg");
    const genderImg = props.gender === 0 ? ("/images/promo/woman/nav-woman.jpg") : ("/images/promo/man/nav-man.jpg");
    const homeLink = props.gender === 0 ? ("/fashion/woman") : ("/fashion/man");
    const fragranceLink = props.gender === 0 ? ("/fashion/woman/fragrance") : ("/fashion/man/fragrance");
    
    const menu = (
        <div className="pml-container">
            <ul className="nav-prod-list">
                <li className="product-category" key={uuidv4()}>
                    <h5 className="product-category-title"><Link to={homeLink}>{menuTitle}</Link></h5>
                    <Link to={homeLink} className="product-cat-img">
                        <img src={genderImg} alt={navData[props.gender].gender + "-home"} />
                    </Link>
                </li>

                {navData[props.gender].navItems.map(item => {
                    if(item.category.toLowerCase() !== "fragrance") {

                        let categoryLink = 
                        `/fashion/${navData[props.gender].gender.toLowerCase()}` +
                        `/${item.category.toLowerCase().replace(/ /g, "_")}`;

                        return (
                            <li className="product-category" key={uuidv4()}>
                                <h5 className="product-category-title"><Link to={categoryLink}>{item.category}</Link></h5>

                                <ul className="product-subcategories">
                                   {item.subcategories.map(subcat => {

                                    let subcatLink = 
                                    `/fashion/${navData[props.gender].gender.toLowerCase()}` + 
                                    `/${item.category.toLowerCase().replace(/ /g, "_")}` +
                                    `/${subcat.toLowerCase().replace(/ /g, "_")}`;

                                        return <li className="product-subcat-link" key={uuidv4()}>
                                                    <Link to={subcatLink}>{subcat}</Link>
                                                </li>
                                   })} 
                                </ul>
                            </li>
                        )    
                    }
                })}

                <li className="product-category" key={uuidv4()}>
                    <h5 className="product-category-title"><Link to={fragranceLink}>Fragrance</Link></h5>
                    <Link to={fragranceLink} className="product-cat-img">
                        <img src={fragranceImg} alt={navData[props.gender].gender + "-fragrance"} />
                    </Link>
                </li>
            </ul>
        </div>
    );

    return (
        <div className="prod-menu-lg">
            {menu}
        </div>
    )
}

export default ProdMenuLG;