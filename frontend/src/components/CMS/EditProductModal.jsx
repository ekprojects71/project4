import React, { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid"; 

import { ProductCategoryContext } from "../../contexts/ProductCategoryContext";

import ProductSizePicker from "./ProductSizePicker";

import "../../css/editProdModal.css";

// This form component takes 3 props:
// 1.) setEditProdToggled - parent state function to toggle the visibility of this modal (when x button is clicked)
// 2.) productId - the product id of the modified product
// 3.) refreshParent() = to update the product list in parent (prodcuts page)

const EditProductModal = (props) => {
    
    //moved sizes prop up since it's used on mount
    const [sizes, setSizes] = useState([]);

    //fetching the product
    const [ product, setProduct ] = useState(null);

    const fetchProduct = async (productNumber) => {
        const response = await fetch(`/api/products/product/${productNumber}`);
        const data = await response.json();
        if(response.status === 200) {
            setProduct(data);

            let sizeValues = [];
            data.sizes.forEach(size => {
                sizeValues.push(size.size_number);
            })
            setSizes([...sizeValues]);
        }
    }
    
    useEffect(() => {
        if(props.productId) {
            fetchProduct(props.productId);
        }
        
    }, []);


    //form-related properties, functions, handlers
    const { register, handleSubmit, reset } = useForm();

    const charLimits = {
        productName: 75,
        description: 200,
        detail1: 100,
        detail2: 100,
        detail3: 100
    };
    const [charCounts, setCharCounts] = useState({
        productName: 75,
        description: 200,
        detail1: 100,
        detail2: 100,
        detail3: 100
    });

    const [productPhotos, setProductPhotos] = useState([]);

    const [markedImages, setMarkedImages] = useState([]);

    const priceLimit = 99999.99;

    

    const [activeGender, setActiveGender] = useState(0);
    const { productCategories } = useContext(ProductCategoryContext);

    const [errors, setErrors] = useState([]);

    //make the post request, handle success or error
    const postProductData = async (formData) => {
        const response = await fetch("/uploads/product", {
                                method: "PUT",
                                body: formData
                            });
        const data = await response.json();

        if(response.status === 200) {
            setErrors([...errors, data.message]);
            reset();
            resetCharCounts();
            props.refreshParent();
        }
        else {
            setErrors([...errors, data.errors]);
        }
    }

    //form submit handler
    const onSubmit = (data, e) => {
        e.preventDefault();
        
        let images = [];
        for(let i = 0; i < productPhotos.length; i++) {
            images.push(productPhotos[i].file);
        }

        const formData = new FormData();
        formData.append("productName", data.productName);
        formData.append("productCode", props.productId);
        formData.append("description", data.description);
        formData.append("detail1", data.detail1);
        formData.append("detail2", data.detail2);
        formData.append("detail3", data.detail3);
        formData.append("price", data.price);
        formData.append("gender", data.gender);
        formData.append("category", data.category);
        formData.append("sizes", JSON.stringify({sizes: [...sizes]}));
        formData.append("markedImages", JSON.stringify({markedImages: [...markedImages]}));
        for(let i = 0; i < images.length; i++) {
            formData.append("files", images[i]);
        }
        window.scrollTo(0,0);
        postProductData(formData);
    };

    //addSize - adds a size to the size list
    const addSize = (inSize) => {
        if(!sizes.find(size => size === inSize)) {
            setSizes([...sizes, inSize]);
        }
    };

    //removeSize - removes a size from the size list
    const removeSize = (outSize) => {
        if(sizes.find(size => size === outSize)) {
            const newList = sizes.filter(size => size !== outSize);
            setSizes([...newList]);
        }
    }; 

    //handler for enforcing character limits
    const handleCharLimits = (e) => {
        setCharCounts({...charCounts, [e.target.name]: charLimits[e.target.name]});
        let charCount = charLimits[e.target.name] - e.target.value.length;
        if(charCount < 0) {
            e.target.value = e.target.value.slice(0, charLimits[e.target.name]);
            charCount = 0;
        }

        setCharCounts({...charCounts, [e.target.name]: charCount});
    };

    //reset character counts
    const resetCharCounts = () => {
        setCharCounts({...charCounts, productName: charLimits["productName"]});
        setCharCounts({...charCounts, description: charLimits["description"]});
        setCharCounts({...charCounts, detail1: charLimits["detail1"]});
        setCharCounts({...charCounts, detail2: charLimits["detail2"]});
        setCharCounts({...charCounts, detail3: charLimits["detail3"]});
    }

    //handler for enforncing price limit
    const handlePrice = (e) => {
        if(e.target.value > priceLimit) {
            e.target.value = priceLimit;
        }
        else if(e.target.value < 0) {
            e.target.value = 0;
        }
    }

    //handler for gender option (used to populate category dropdown)
    const handleGender = (e) => {
        setActiveGender(e.target.value);
    }

    //handler for displaying image previews
    const handleImageUploads = (e) => {
        setProductPhotos(productPhotos.length = 0);
        let files = e.target.files;
        let images = [];

        for(let i = 0; i < files.length; i++) {
            images.push({ file: files[i], url: URL.createObjectURL(files[i]) })
        }
        
        setProductPhotos([...productPhotos, ...images]);
    }

    //handler for marking images for deleting
    const markImage = (e) => {
        let images = markedImages;
        e.target.parentNode.classList.toggle("marked");
        if(images.includes(e.target.getAttribute("data-id"))) {
            images = images.filter(image => image !== e.target.getAttribute("data-id"));
        }
        else {
            images = [...images, e.target.getAttribute("data-id")];
        }

        setMarkedImages([...images]);
    };



    return (
        <div className="edit-product-modal">
            <div className="container">
            
                {/* Menu Header */}
                <div className="menu-header">
                    <div className="menu-header-title">
                        <span>Edit Product</span>
                    </div>
                    <div className="menu-header-close">
                        <button onClick={() => props.setEditProdToggled(false)} 
                            ><img src="/assets/icons/x-icon.svg" alt="close-menu"/></button>
                    </div>
                </div>

                {/* Messages */}
                { errors.length > 0 && 
                    <div className="error-messages">
                        <ul>
                            {errors.length > 0 ? (
                                errors.map(error => {
                                    return (
                                        <li key={uuidv4()}>{error}</li>
                                    )
                                })
                                
                            ) : ("")}
                        </ul>
                    </div>
                }

                {product ? (
                <div className="main-content">              
                    {/* Product form, submit a new product */}
                    <form onSubmit={handleSubmit(onSubmit)}>

                        <div className="product-name">
                            <h3>Product Name</h3>

                            <input type="text" name="productName" placeholder="Product Name" 
                                onChange={handleCharLimits} defaultValue={product.name} required
                                ref={register} 
                            />
                            <span className="char-limit-msg">
                                {`${charCounts.productName} characters remaining`}
                            </span>    
                        </div>
                        
                        <div className="product-description">
                            <h3>Description</h3>

                            <textarea name="description" onChange={handleCharLimits} 
                                placeholder="Product description" defaultValue={product.description} required
                                ref={register} 
                            />
                            <span className="char-limit-msg">
                                {`${charCounts.description} characters remaining`}
                            </span>    
                        </div>
                        
                        <div className="product-details">
                            <h3>Product Details</h3>

                            <textarea name="detail1" onChange={handleCharLimits} 
                                placeholder="Bullet point 1" defaultValue={product.details[0].detail_info} required
                                ref={register} 
                            />
                            <span className="char-limit-msg">
                                {`${charCounts.detail1} characters remaining`}
                            </span>

                            <textarea name="detail2" onChange={handleCharLimits} 
                                placeholder="Bullet point 2" defaultValue={product.details[1].detail_info} required
                                ref={register} 
                            />
                            <span className="char-limit-msg">
                                {`${charCounts.detail2} characters remaining`}
                            </span>

                            <textarea name="detail3" onChange={handleCharLimits} 
                                placeholder="Bullet point 3" defaultValue={product.details[2].detail_info} required
                                ref={register} 
                            />
                            <span className="char-limit-msg">
                                {`${charCounts.detail3} characters remaining`}
                            </span>    
                        </div>

                        
                        <div className="product-price">
                            <h3>Price</h3>

                            <input type="number" name="price" step="0.01" min="0" 
                                max="99999.99" placeholder="Enter a price ($)" defaultValue={product.price} required
                                onChange={handlePrice} 
                                ref={register}
                            />    
                        </div>
                        
                        <div className="product-gender">
                            <h3>Gender</h3>

                            <div className="radio-group">
                                <input type="radio" id="woman" value="0" 
                                    name="gender" defaultChecked required 
                                    ref={register}
                                    onChange={handleGender}
                                />
                                <label htmlFor="woman">Woman</label>   
                            </div>

                            <div className="radio-group">
                                <input type="radio" id="man" value="1" 
                                    name="gender" required 
                                    ref={register}
                                    onChange={handleGender}
                                />
                                <label htmlFor="man">Man</label>
                            </div>    
                        </div>

                        <div className="product-category">
                            <h3>Category</h3>

                            <select name="category" className="categories"
                                required ref={register}
                            >
                                {productCategories ? (productCategories[activeGender].subcategories.map(category => {
                                    return (
                                       <option value={category.id} key={category.id}>
                                            {category.subcategory}
                                       </option> 
                                    )
                                })) : ("")}
                            </select>
                        </div>

                        <div className="product-sizes">
                            <h3>Sizes</h3>
                            <span>Select any sizes that apply. You may ignore this field if the product doesn't require sizes.</span>

                            <ProductSizePicker 
                                activeSizes={sizes}
                                addSize={addSize}
                                removeSize={removeSize}
                            />
                        </div>

                        <div className="delete-images">
                            <h3>Delete Existing Images</h3>
                            <span>Click on any image that you wish to mark for deletion. To undo, click on it again.</span>

                            <div className="delete-img-grid">
                                {product.images.map(img => {
                                    let imgUrl = img.image_url.replace("public", "").trim();
                                    let index = imgUrl.lastIndexOf(".");
                                    imgUrl = imgUrl.substring(0, index)+"_s"+imgUrl.substring(index);

                                    return (
                                        <div className="deletable" key={imgUrl}>
                                            <img src={imgUrl} data-id={img.image_url} 
                                             onClick={markImage}
                                            />    
                                        </div>
                                        
                                    )
                                })}
                            </div>
                        </div>
                        
                        <div className="product-images">
                            <h3>Upload Additional Images</h3>
                            <span>
                                Images must be in .jpg format and may not exceed 1.5MB per image. Otherwise, 
                                they will not be saved.
                            </span>

                            <input type="file" id="files" name="images" 
                                accept="image/png,image/jpeg" multiple 
                                onChange={handleImageUploads}
                            />    
                        </div>

                        <div className="goodlookinout">
                            <p><b>Please make sure the sizes, gender, and category are correct before submitting.</b></p>
                            <p>Also, since heroku does not persist static files, I have disabled the editing & removal of images on the back-end. Thank you for understanding.</p>
                        </div>

                        <input type="submit" value="Update Product" />
                    </form>

                    {/* Preview product images */}
                    <div className="img-preview">
                        {productPhotos.length > 0 ? (
                            productPhotos.map(photo => {
                                return (
                                    <img src={photo.url} alt="preview" key={uuidv4()} />
                                )
                            })
                        ) : ("")}
                    </div>
                </div>
                ) : (<div>Just a moment...</div>)}
                
            </div>
        </div>
    )
};

export default EditProductModal;