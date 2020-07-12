import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

//contexts
import { NavContext } from "../../contexts/NavContext";

const ProdMenuSM = (props) => {

    const { navData } = useContext(NavContext);

    const [isWomanExpanded, setWomanExpanded] = useState(false);
    const [isManExpanded, setManExpanded] = useState(false);
    
    //0 = woman,  1 = man
    const fragranceImg = ["/images/promo/woman/nav-fragrance-woman.jpg", "/images/promo/man/nav-fragrance-man.jpg"];
    const genderImg = ["/images/promo/woman/nav-woman.jpg", "/images/promo/man/nav-man.jpg"];
    const homeLink = ["/fashion/woman", "/fashion/man"];
    const fragranceLink = ["/fashion/woman/fragrance", "/fashion/man/fragrance"];

    //event handlers
    const expandMenu = (gender => {
        if(gender === "WOMAN") {
            setWomanExpanded(!isWomanExpanded);
        }
        else {
            setManExpanded(!isManExpanded);
        }
    });


    const menu = (
        <div className="pms-container">
            <nav className="navigation-panel">
                {/* Menu Header */}
                <div className="menu-header">
                    <div className="menu-header-title">
                        <span>Menu</span>
                    </div>
                    <div className="menu-header-close">
                        <button onClick={() => props.setMenuToggled(false)} 
                            ><img src="/assets/icons/x-icon.svg" alt="close-menu"/></button>
                    </div>
                </div>

                {/* WOMAN NAV LINKS */}
                <ul className="gender-options">
                    <li className="gender-woman" key={uuidv4()}>
                        <button className={`expand-list ${isWomanExpanded ? "expanded" : "collapsed"}`}
                                onClick={()=>expandMenu("WOMAN")}>
                                <span className='list-label'>Women's Fashion</span>
                                <img src="/assets/icons/chevron.svg" alt="collapse-expand" className='expand-icon'></img>
                        </button>

                        <ul className={`categories ${isWomanExpanded ? "expanded" : "collapsed"}`}>

                            {navData[0].navItems.map(item => {
                                if(item.category.toLowerCase() !== "fragrance") {

                                    let categoryLink = 
                                    `/fashion/${navData[0].gender.toLowerCase()}` +
                                    `/${item.category.toLowerCase().replace(/ /g, "_")}`;

                                    return (
                                        <li className="category" key={uuidv4()}>
                                            <h5 className="category-title"><Link to={categoryLink} 
                                                onClick={() => props.setMenuToggled(false)}>
                                                    {item.category}</Link></h5>
                                            
                                            <ul className="subcategories" key={uuidv4()}>

                                                {item.subcategories.map(subcat => {

                                                    let subcatLink = 
                                                    `/fashion/${navData[0].gender.toLowerCase()}` + 
                                                    `/${item.category.toLowerCase().replace(/ /g, "_")}` +
                                                    `/${subcat.toLowerCase().replace(/ /g, "_")}`;

                                                    return (
                                                        <li className="subcategory" key={uuidv4()}>
                                                            <Link to={subcatLink}
                                                                onClick={() => props.setMenuToggled(false)}
                                                                >{subcat}</Link>    
                                                        </li>    
                                                    )
                                                })}
                                            </ul>
                                        </li>
                                    )
                                }
                            })}

                            <li className="category img-item" key={uuidv4()}>
                                <div className="img-item-container">
                                    <h5 className="category-title"><Link to={homeLink[0]}
                                        onClick={() => props.setMenuToggled(false)}>
                                            Explore Women's</Link></h5>
                                    <Link to={homeLink[0]}
                                        onClick={() => props.setMenuToggled(false)}>
                                        <img src={genderImg[0]} alt="Woman-Home" />
                                    </Link>
                                </div>
                            </li>

                            <li className="category img-item" key={uuidv4()}>
                                <div className="img-item-container">
                                    <h5 className="category-title"><Link to={fragranceLink[0]}
                                        onClick={() => props.setMenuToggled(false)}>
                                            Women's Fragrance</Link></h5>
                                    <Link to={fragranceLink[0]} className="product-cat-img"
                                        onClick={() => props.setMenuToggled(false)}>
                                        <img src={fragranceImg[0]} alt="Woman-Fragrance-Home" />
                                    </Link>
                                </div>
                            </li>
                        </ul>
                    </li>
                    
                    {/* MAN NAV LINKS */}
                    <li className="gender-man" key={uuidv4()}>
                        <button className={`expand-list ${isManExpanded ? "expanded" : "collapsed"}`}
                                onClick={()=>expandMenu("MAN")}>
                                <span className='list-label'>Men's Fashion</span>
                                <img src="/assets/icons/chevron.svg" alt="collapse-expand" className='expand-icon'></img>
                        </button>

                        <ul className={`categories ${isManExpanded ? "expanded" : "collapsed"}`}>

                            {navData[1].navItems.map(item => {

                                let categoryLink = 
                                    `/fashion/${navData[1].gender.toLowerCase()}` +
                                    `/${item.category.toLowerCase().replace(/ /g, "_")}`;

                                if(item.category.toLowerCase() !== "fragrance") {
                                    return (
                                        <li className="category" key={uuidv4()}>
                                            <h5 className="category-title"><Link to={categoryLink}
                                                onClick={() => props.setMenuToggled(false)}>
                                                    {item.category}</Link></h5>
                                            
                                            <ul className="subcategories" key={uuidv4()}>

                                                {item.subcategories.map(subcat => {

                                                    let subcatLink = 
                                                    `/fashion/${navData[1].gender.toLowerCase()}` + 
                                                    `/${item.category.toLowerCase().replace(/ /g, "_")}` +
                                                    `/${subcat.toLowerCase().replace(/ /g, "_")}`;

                                                    return (
                                                        <li className="subcategory" key={uuidv4()}>
                                                            <Link to={subcatLink}
                                                                onClick={() => props.setMenuToggled(false)}>
                                                                    {subcat}</Link>    
                                                        </li>    
                                                    )
                                                })}
                                            </ul>
                                        </li>
                                    )
                                }
                            })}

                            <li className="category img-item" key={uuidv4()}>
                                <div className="img-item-container">
                                    <h5 className="category-title"><Link to={homeLink[1]}
                                        onClick={() => props.setMenuToggled(false)}>
                                            Explore Men's</Link></h5>
                                    <Link to={homeLink[1]}
                                        onClick={() => props.setMenuToggled(false)}>
                                        <img src={genderImg[1]} alt="Man-Home" />
                                    </Link>
                                </div>
                            </li>

                            <li className="category img-item" key={uuidv4()}>
                                <div className="img-item-container">
                                <h5 className="category-title"><Link to={fragranceLink[1]}
                                    onClick={() => props.setMenuToggled(false)}>
                                        Men's Fragrance</Link></h5>
                                    <Link to={fragranceLink[1]} className="product-cat-img"
                                        onClick={() => props.setMenuToggled(false)}>
                                        <img src={fragranceImg[1]} alt="Man-Fragrance" />
                                    </Link> 
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </div>
    );

    return (
        <div className="prod-menu-sm white">
            {menu}
        </div>
    )
}

export default ProdMenuSM;