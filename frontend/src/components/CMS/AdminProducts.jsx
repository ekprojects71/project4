import React, { useState, useEffect, useContext } from "react";
import { Link, withRouter } from "react-router-dom";

import { AuthContext } from "../../contexts/AuthContext";

import AdminLinks from "./AdminLinks";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";

import Loading from "../loading/loading";

import "../../css/adminProducts.css";

const AdminProducts = (props) => {

    const [ addProdToggled, setAddProdToggled ] = useState(false);
    const [ editProdToggled, setEditProdToggled ] = useState(false);

    const [ currentProduct, setCurrentProduct ] = useState(null);

    const [ products, setProducts ] = useState(null);
    const [ filtered, setFiltered ] = useState(null);

    const fetchProducts = async () => {
        const response = await fetch("/api/products/all-products");
        const data = await response.json();
        if(response.status === 200) {
            setProducts([...data]);
            setFiltered([...data]);
        }
    }

    //auth context for guarding the route
    const { authenticated, checkAuth } = useContext(AuthContext);

    //redirect to my-account on register, or if already logged in
    const validateOnMount = async () => {
        if(!authenticated) {
            props.history.push("/account/login");
        }
        const validated = await checkAuth();
        if(!validated) {
            props.history.push("/account/login");
        }
        else {
            if(!products) {
                fetchProducts();
            }    
        }
    };

    //fetch products on mount
    useEffect(() => {
        validateOnMount();
    }, []);


    //handlers
    const handleSearch = (e) => {
        let newList = products;
        newList = newList.filter(product => 
            product.name.toLowerCase().includes(e.target.value.toLowerCase()));
        setFiltered([...newList]);
    }

    const handleEdit = (e) => {
        let product = e.target.getAttribute("data-id");
        setEditProdToggled(true);
        setCurrentProduct(product);
    }

    return (
        <div className="admin-products">
            <div className="container">
                <header className="admin-header">
                    <Link to="/">
                        <img src="/assets/company/logo.svg" alt="logo" />
                    </Link>
                    <p>Content Management</p>
                </header>

                <AdminLinks />    


                {products ? (<div>

                <main className="products-menu">
                    
                    <div className="filters">
                        <h1>Product Management</h1>

                        <div className="filter-right">
                            <div className="search-filter">
                                <input type="text" placeholder="Search for a product" onChange={handleSearch}/>
                            </div>

                            <div className="add-product">
                                <button onClick={() => setAddProdToggled(true)}>Add New Product</button>    
                            </div>    
                        </div>
                    </div>

                    <div className="products-list-container">
                        <h2>Products</h2>
                        <p>
                            Note: This list only lists products that are editable. 
                            The original catalogue is not editable for demo purposes.
                        </p>
                        {filtered && filtered.length > 0 ? (
                            <ul className="products-list">
                                {filtered.map(product => {
                                    let imgUrl = product.image.replace("public", "").trim();
                                    let index = imgUrl.lastIndexOf(".");
                                    imgUrl = imgUrl.substring(0, index)+"_s"+imgUrl.substring(index);

                                    return (
                                        <li className="product-item" key={product.itemId}>
                                            <div className="thumbnail">
                                                <img src={imgUrl} alt="thumbnail" />
                                            </div>
                                            <div className="name">
                                                <span>{product.name}</span>
                                            </div>
                                            <div className="edit-btn">
                                                <button data-id={product.itemId}
                                                    onClick={handleEdit}>
                                                Edit</button>
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        ) : (
                            <div className="no-products">
                                <p>
                                    There are no editable products. To test this feature,
                                    add a new product.
                                </p>
                            </div>
                        )}
                    </div>
                </main>
                
                </div>) : (<Loading />)}

            </div>
            
            {/* modals */}
            {addProdToggled && <AddProductModal 
                refreshParent={fetchProducts}
                setAddProdToggled={setAddProdToggled} />}
            {editProdToggled && <EditProductModal
                refreshParent={fetchProducts}
                setEditProdToggled={setEditProdToggled}
                productId={currentProduct}
                />}
        </div>
    )
}

export default withRouter(AdminProducts);