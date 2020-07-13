const pool = require("./index.js");
const bcrypt = require("bcrypt");

//GENERAL SELECT QUERIES
const getNavbarData = async () => {
    try {

        const results = await pool.query(`select s.subcategory_name, c.category_name, g.gender_name
        from product_subcategory as s, product_category as c, gender as g
        where s.product_category_id = c.product_category_id and s.gender_id = g.gender_id`, []);
        
        let output = [];

        let genders = ["Woman", "Man"];

        let categories = new Set();
        results.rows.forEach(category => { categories.add(category.category_name) });
        
        genders.forEach(gender => {

            let links = [];
            
            categories.forEach(category => {
                
                let filteredSubcat = results.rows.filter(subcat => subcat.gender_name == gender || 
                                        subcat.gender_name == "Both")
                                        .filter(subcat => subcat.category_name == category);
                let subcategories = [];
                filteredSubcat.forEach(subcat => subcategories.push(subcat.subcategory_name));
                
                links.push({
                    category: category, 
                    subcategories: subcategories
                })
            })

            output.push({
                gender: gender, navItems: links
            })
        });

        return output;
    }
    catch { return null; }
};


const getProductSubcategories = async () => {
    try {

        const results = await pool.query(`select s.subcategory_name, s.subcategory_number, g.gender_name
        from product_subcategory as s, gender as g
        where  s.gender_id = g.gender_id`, []);
        
        let output = [];

        let genders = ["Woman", "Man"];
        
        genders.forEach(gender => {
            let genderItems = results.rows.filter(subcat => subcat.gender_name == gender || 
                                    subcat.gender_name == "Both");
            let subcategories = [];
            genderItems.forEach(subcat => subcategories.push({
                subcategory: subcat.subcategory_name, 
                id: subcat.subcategory_number }));
            
            output.push({
                gender: gender, subcategories: subcategories
            })
        });

        return output;
    }
    catch { return null; }
};


const getHomepageData = async () => {
    try {
        
        const results = await pool.query('select content from page_content where content_type_id = $1', [1]);
        const data = await results.rows[0].content;

        return data;
    }
    catch { return null; }
};


const getPromoBannerData = async () => {
    try {
        
        const results = await pool.query('select content from page_content where content_type_id = $1', [2]);
        const data = await results.rows[0].content;

        return data;
    }
    catch { return null; }
};


const getGenderPageData = async (genderId) => {
    try {
        
        const results = await pool.query('select content from page_content where content_type_id = $1', [genderId]);
        const data = await results.rows[0].content;

        return data;
    }
    catch { return null; }
};

const getProductSizes = async () => {
    try {
        
        const results = await pool.query('select size_value, size_number from sizes', []);
        const data = await results.rows;

        return data;
    }
    catch { return null; }
};

const getProductsByCategory = async ( gender, category, subcategory) => {
    try {
        let data = null;
        let products = [];

        if(subcategory) {
            //get products by subcategory
            const subcatIdQuery = await pool.query(`
            select product_subcategory_id from product_subcategory
            where subcategory_name = initcap($1)
            `, [subcategory]);
            const subcatId = await subcatIdQuery.rows[0].product_subcategory_id;

            const productsQuery = await pool.query(`
            select distinct on (pi.product_id) p.product_id, p.item_id, p.product_name, 
                p.description, p.price, p.sale_price, p.on_sale, i.image_url 
            from product as p, product_image as pi, image as i
            where p.product_subcategory_id = $1 and p.gender_id = $2 and
                pi.product_id = p.product_id and i.image_id = pi.image_id
            order by pi.product_id, i.image_url asc   
            `, [subcatId, gender]);
            data = await productsQuery.rows;
        }
        else {
            //get products by category
            const categoryIdQuery = await pool.query(`
            select product_category_id from product_category
            where category_name = initcap($1)
            `, [category]);
            const categoryId = await categoryIdQuery.rows[0].product_category_id;

            const productsQuery = await pool.query(`
            select distinct on (pi.product_id) p.product_id, p.item_id, p.product_name, 
                p.description, p.price, p.sale_price, p.on_sale, i.image_url 
            from product as p, product_category as c, product_subcategory as s,
                product_image as pi, image as i
            where c.product_category_id = $1 and p.gender_id = $2 and
                p.product_subcategory_id = s.product_subcategory_id and
                s.product_category_id = c.product_category_id and
                pi.product_id = p.product_id and i.image_id = pi.image_id
            order by pi.product_id, i.image_url asc
            `, [categoryId, gender]);
            data = await productsQuery.rows;
        }

        //process the query results, send appropriate product data to client
        data.forEach(product => {
            products.push( {
                itemId: product.item_id,
                name: product.product_name,
                price: product.on_sale ? (product.sale_price) : (product.price),
                imageUrl: product.image_url
            });
        });

        return products;

    }
    catch { return null; }
};

const getProduct = async (productCode) => {
    try {
        //get product row
        const productQuery = await pool.query(`
        select * from product where item_id = $1
        `, [productCode]);
        const productData = await productQuery.rows[0];

        //get product image
        const imagesQuery = await pool.query(`
        select i.image_url
        from image as i, product_image as pi
        where pi.product_id = $1 and pi.image_id = i.image_id
        order by pi.product_id, i.image_url asc
        `, [productData.product_id]);
        let images = await imagesQuery.rows;

        //get product details
        const detailsQuery = await pool.query(`
        select detail_info from product_details where product_id = $1
        `, [productData.product_id]);
        let details = await detailsQuery.rows;

        //get product sizes
        const sizesQuery = await pool.query(`
        select s.size_value, s.size_number 
        from sizes as s, product_size as ps
        where ps.product_id = $1 and ps.size_id = s.size_id
        order by s.size_id asc
        `, [productData.product_id]);
        let sizes = await sizesQuery.rows;
        
        //assemble object, send to client
        const product = {
            itemId: productData.item_id,
            name: productData.product_name,
            description: productData.description,
            price: productData.price,
            salePrice: productData.sale_price,
            onSale: productData.on_sale,
            images: images,
            details: details,
            sizes: sizes
        };

        return product;
    }
    catch { return null; }
};


//POSTING, UPDATING, AND DELETING PRODUCT
const addProduct = async (product, images) => {
    try {

        //insert product - product table
        const productQuery = await pool.query(`
            insert into product (product_name, description, price, 
                sale_price, gender_id, on_sale, deletable)
            values ($1, $2, $3, $4, $5, $6, $7)
            RETURNING product_id
        `, [product.productName, product.description, product.price, 
            product.price, product.gender + 1, false, true]);
        const productID = await productQuery.rows[0];
        
        const subcatQuery = await pool.query(`
            select product_subcategory_id
            from product_subcategory
            where subcategory_number = $1
        `, [product.category]);
        const subcatID = await subcatQuery.rows[0];
        const subcatInsert = await pool.query(`
            update product
            set product_subcategory_id = $1
            where product_id = $2
        `, [subcatID.product_subcategory_id, productID.product_id]);
        

        //insert product details - product_details table
        for(let i = 0; i < 3; i++) {
            const prodDetailsQuery = await pool.query(`
                insert into product_details (detail_info, product_id)
                values ($1, $2)
            `, [product[`detail${i+1}`], productID.product_id]);    
        }
        
        //insert product sizes - product_size table
        const sizeIdQuery = await pool.query(`
            select size_id, size_number from sizes
        `, []);
        const sizeIds = await sizeIdQuery.rows;
        const prodSizes = [];
        sizeIds.forEach(sizeId => {
            product.sizes.forEach(size => {
                if(sizeId.size_number === size) {
                    prodSizes.push(sizeId.size_id);
                }
            })
        })
        const prodSizesInsert = `
            insert into product_size (product_id, size_id) 
            values ($1, $2)`;
        prodSizes.forEach(async prodSize => {
            const prodSizesQuery = await pool.query(prodSizesInsert, 
                [productID.product_id, prodSize]);    
        })


        //insert images & product images - image, product_image tables
        images.forEach(async image => {
            const imagesInsert = await pool.query(`
                insert into image (image_url)
                values ($1)
                RETURNING image_id
            `, [image]);

            const imageId = await imagesInsert.rows[0].image_id;

            const prodImagesQuery = await pool.query(`
                insert into product_image (product_id, image_id)
                values ($1, $2)
            `, [productID.product_id, imageId]); 
        });
               

        return "successfully added product";
    }
    catch { return null; };
};

const updateProduct = async (product, images) => {
    try {
        //get the product id
        const productIdQuery = await pool.query(`
            select product_id, deletable from product
            where item_id = $1
        `, [product.productCode]);
        const productId = await productIdQuery.rows[0].product_id;
        const deletable = await productIdQuery.rows[0].deletable;
        //protects products that are demo-only
        if(!deletable) { 
            throw null;
        }

        //update product - product table
        const productQuery = await pool.query(`
            update product 
                set product_name = $1, description = $2, price = $3, 
                sale_price = $4, gender_id = $5
            where product_id = $6
            returning product_id
        `, [product.productName, product.description, product.price, 
            product.price, product.gender + 1, productId]);
        const productID = await productQuery.rows[0];
        
        const subcatQuery = await pool.query(`
            select product_subcategory_id
            from product_subcategory
            where subcategory_number = $1
        `, [product.category]);
        const subcatID = await subcatQuery.rows[0];
        const subcatInsert = await pool.query(`
            update product
            set product_subcategory_id = $1
            where product_id = $2
        `, [subcatID.product_subcategory_id, productID.product_id]);
        

        //update details - product_details table
        const detailIdsQuery = await pool.query(`
            select product_detail_id
            from product_details
            where product_id = $1
        `, [productID.product_id]);
        const detailIds = await detailIdsQuery.rows;

        for(let i = 0; i < detailIds.length; i++) {
            const prodDetailsQuery = await pool.query(`
                update product_details 
                set detail_info = $1 
                where product_id = $2 and product_detail_id = $3
            `, [product[`detail${i+1}`], productID.product_id, detailIds[i].product_detail_id ]);
        }
        
        //insert product sizes - product_size table
        const sizeIdQuery = await pool.query(`
            select size_id, size_number from sizes
        `, []);
        const sizeIds = await sizeIdQuery.rows;
        const prodSizes = [];
        sizeIds.forEach(sizeId => {
            product.sizes.forEach(size => {
                if(sizeId.size_number === size) {
                    prodSizes.push(sizeId.size_id);
                }
            })
        })

        const prodSizesDeleteQuery = await pool.query(`
            delete from product_size
            where product_id = $1
        `, [productID.product_id]);

        const prodSizesInsert = `
            insert into product_size (product_id, size_id) 
            values ($1, $2) 
        `;
        prodSizes.forEach(async prodSize => {
            const prodSizesQuery = await pool.query(prodSizesInsert, 
                [productID.product_id, prodSize]);    
        })

        /*  - DISABLED DUE TO HEROKU (...but it does work) -

        //delete any images that were marked for deletion
        if(product.markedImages.length > 0) {
            //get the image ids
            let imgIdQueryText = `
                select image_id 
                from image
                where 
            `;
            
            for(let i = 0; i < product.markedImages.length; i++) {
                if(i+1 < product.markedImages.length) {
                    imgIdQueryText += ` image_url = $${i+1} or `;    
                }
                else {
                    imgIdQueryText += ` image_url = $${i+1}`;
                }
            }

            const imgIdQuery = await pool.query(imgIdQueryText, [...product.markedImages]);
            const imgIDs = await imgIdQuery.rows;
            let ids = [];

            //delete from product images
            let prodImageQueryText = `
                delete from product_image
                where 
            `;

            for(let i = 0; i < imgIDs.length; i++) {
                if(i+1 < imgIDs.length) {
                    prodImageQueryText += ` image_id = $${i+1} or `;    
                }
                else {
                    prodImageQueryText += ` image_id = $${i+1}`;
                }
                ids.push(imgIDs[i].image_id);
            }

            const prodImageQuery = await pool.query(prodImageQueryText, [...ids]);


            //finally, delete the images
            let delImgQueryText = `
                delete from image
                where 
            `;

            for(let i = 0; i < product.markedImages.length; i++) {
                if(i+1 < product.markedImages.length) {
                    delImgQueryText += ` image_url = $${i+1} or `;    
                }
                else {
                    delImgQueryText += ` image_url = $${i+1}`;
                }
            }

            const delImgQuery = await pool.query(delImgQueryText, [...product.markedImages]);
        }


        if(images.length > 0) {
            //insert images & product images - image, product_image tables
            images.forEach(async image => {
                const imagesInsert = await pool.query(`
                    insert into image (image_url)
                    values ($1)
                    RETURNING image_id
                `, [image]);

                const imageId = await imagesInsert.rows[0].image_id;

                const prodImagesQuery = await pool.query(`
                    insert into product_image (product_id, image_id)
                    values ($1, $2)
                `, [productID.product_id, imageId]); 
            });    
        }

        */

        return "successfully updated product";
    }
    catch { return null; };
};


//CMS-related queries (product section)
//Retrieves all products info (id, item_id, name, top-img) for CMS - populates the product list
const getAllProducts = async () => {
    try {
        let products = [];

        //get all the product data
        const productsQuery = await pool.query(`
            select product_id, product_name, item_id, s.subcategory_number
            from product, product_subcategory as s 
            where product.product_subcategory_id = s.product_subcategory_id
                and product.deletable = true
        `, []);
        const productData = await productsQuery.rows;

        //get the image for each product
        const imgQuery = await pool.query(`
                select distinct on (pi.product_id) i.image_url, pi.product_id
                from image as i, product_image as pi
                where pi.image_id = i.image_id
                order by pi.product_id, i.image_url asc
            `, []);
        const img = await imgQuery.rows;

        //build the products array
        productData.forEach(async product => {
            let image = img.find(image => product.product_id === image.product_id);

            products.push({
                itemId: product.item_id,
                name: product.product_name,
                subcategory: product.subcategory_number,
                image: image.image_url
            });
        });

        return products;
    }
    catch { return null; }
};



//retrieving, updating & deleting the user's shopping cart
const getCart = async (accountNumber) => {
    try {
        //get the userId
        const userQuery = await pool.query(`
            select user_id from users
            where account_number = $1
        `, [accountNumber]);
        const userId = await userQuery.rows[0].user_id;

        //check if the user has cart
        const checkUserCart = await pool.query(`
            select shopping_cart_id from shopping_cart
            where user_id = $1
        `, [userId]);
        const userCart = await checkUserCart.rows;

        //if the user has a shopping cart record -> grab cart data
        //else return null
        let results = null;
        if(userCart.length > 0) {
            const cartQuery = await pool.query(`
                select contents from shopping_cart
                where user_id = $1
            `, [userId]);
            results = await cartQuery.rows[0].contents;
        }

        return results;
    }
    catch { return null; };
};


const updateCart = async (accountNumber, cart) => {
    try {

        //get the userId
        const userQuery = await pool.query(`
            select user_id from users
            where account_number = $1
        `, [accountNumber]);
        const userId = await userQuery.rows[0].user_id;

        //check if the user has cart
        const checkUserCart = await pool.query(`
            select shopping_cart_id from shopping_cart
            where user_id = $1
        `, [userId]);
        const userCart = await checkUserCart.rows;

        //if cart exists -> Update
        //else -> Insert
        let results = null;
        if(userCart.length > 0) {
            const updateQuery = await pool.query(`
                update shopping_cart 
                set contents = $1
                where user_id = $2
                returning contents
            `, [cart, userId]);
            results = await updateQuery.rows[0].contents;
        }
        else {
            const insertQuery = await pool.query(`
                insert into shopping_cart(user_id, contents) values
                ($1, $2)
                returning contents
            `, [userId, cart]);
            results = await insertQuery.rows[0].contents;
        }

        return results;
    }
    catch { return null; };
};

const deleteCart = async (accountNumber) => {
    try {
        //get the userId
        const userQuery = await pool.query(`
            select user_id from users
            where account_number = $1
        `, [accountNumber]);
        const userId = await userQuery.rows[0].user_id;

        //check if the user has cart
        const checkUserCart = await pool.query(`
            select shopping_cart_id from shopping_cart
            where user_id = $1
        `, [userId]);
        const userCart = await checkUserCart.rows;

        //if the user has a shopping cart record -> delete
        //else return null
        let results = null;
        if(userCart.length > 0) {
            const deleteQuery = await pool.query(`
                delete from shopping_cart
                where user_id = $1
                returning *
            `, [userId]);
            results = await deleteQuery.rows[0];
        }

        return results;
    }
    catch { return null; };
};


//order-related queries, add order, get orders by customer
const getOrders = async (accountNumber) => {
    try {

        //get the userId
        const userQuery = await pool.query(`
            select user_id from users
            where account_number = $1
        `, [accountNumber]);
        const userId = await userQuery.rows[0].user_id;

        //get the user's orders
        const results = await pool.query(`
            select order_contents, order_number, date,
                street_address, city, state_usa, zipcode 
            from orders
            where user_id = $1
        `, [userId]);
        const orders = await results.rows;

        let output = [];
        if(orders.length > 0) {
            orders.forEach(order => {
                output.push({
                    orderNumber: order.order_number,
                    date: parseInt(order.date),
                    streetAddress: order.street_address,
                    city: order.city,
                    state: order.state_usa,
                    zipcode: order.zipcode,
                    contents: order.order_contents
                });
            });    
        }

        return output;
    }
    catch { return null; };
};

const addOrder = async (accountNumber, order) => {
    try {

        //get the user's info
        const userQuery = await pool.query(`
            select user_id, first_name, last_name, street_address,
                city, state_usa, zipcode
            from users
            where account_number = $1
        `, [accountNumber]);
        const user = await userQuery.rows[0];

        let date = Date.now().toString();

        //insert the order
        const results = await pool.query(`
            insert into orders (user_id, street_address, city, 
                state_usa, zipcode, order_contents, date)
            values ($1, $2, $3, $4, $5, $6, $7)
            returning order_number
        `, [user.user_id, user.street_address, user.city, 
            user.state_usa, user.zipcode, order, date]);
        const data = await results.rows[0];

        return data;
    }
    catch { return null; };
};


//gets the user's personal info
const getUserInfo = async (accountNumber) => {
    try {

        //get the userId
        const userQuery = await pool.query(`
            select user_id from users
            where account_number = $1
        `, [accountNumber]);
        const userId = await userQuery.rows[0].user_id;

        //get the user's info
        const results = await pool.query(`
            select first_name, last_name, street_address, city, 
                state_usa, zipcode, isadmin
            from users
            where user_id = $1
        `, [userId]);
        const user = await results.rows[0];

        let output = {
            firstName: user.first_name,
            lastName: user.last_name,
            streetAddress: user.street_address,
            city: user.city,
            state: user.state_usa,
            zipcode: user.zipcode,
            isAdmin: user.isadmin
        };

        return output;
    }
    catch { return null; };
};


//AUTH queries
const loginUser = async (email, password) => {
    try {
        const results = await pool.query(`
            select * from users
            where user_email = $1
        `, [email]);
        const data = await results.rows[0];
        
        //validate the user credentials
        if(data.user_email !== email) 
        {
           throw "invalid credentials";
        }
        
        let machingPW = await bcrypt.compare(password, data.user_password);
        if(!machingPW){
            throw "invalid credentials";
        }

        //return the account object, used in session
        let account = {
            email: data.user_email,
            accountNumber: data.account_number,
            isAdmin: data.isadmin
        };

        return account;
    }
    catch { return null; };
};

const registerUser = async (user) => {
    try {
        //first, check if the email is taken
        const checkEmail = await pool.query(`
            select user_email from users
            where user_email = $1
        `, [user.email]);
        const emailResult = await checkEmail.rows[0];
        if(emailResult && emailResult.user_email === user.email) {
            throw 1;
        }

        //encrypt the password - salt & hash with bycrpt
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = await hashedPassword;
        
        
        //register the user
        const results = await pool.query(`
            insert into users (user_email, user_password, 
                        first_name, last_name, street_address, 
                    city, state_usa, zipcode)
            values ($1, $2, $3, $4, $5, $6, $7, $8)
            returning user_email, user_password
        `, [user.email, user.password, user.firstName,
            user.lastName, user.streetAddress, user.city,
            user.state, user.zipcode]);
        const data = await results.rows[0];

        return data;
    }
    catch(err) { 
        if(err === 1) { 
            return 1; 
        }
        return null; 
    };
};



//HEROKU-RELATED CLEANUP QUERIES
//CLEANUP - delete all non-admin users as well as their orders
const deleteUsers = async () => {
    try {
        //grab all the user ids
        const userIdQuery = await pool.query(`
            select user_id from users
            where isadmin = false
        `, []);
        const userIds = await userIdQuery.rows;

        if(!userIds || userIds.length === 0) {
            return null;
        }

        //nuke the shopping cart
        const nukeCart = await pool.query(`delete from shopping_cart`, []);

        //delete all non-admin orders
        let ids = [];
        userIds.forEach(id => {ids.push(id.user_id)});
        
        let deleteQueryText = `
            delete from orders
            where 
        `;
        for(let i = 0; i < ids.length; i++) {
            if(i+1 < ids.length) {
                deleteQueryText += ` user_id = $${i+1} or `;    
            }
            else {
                deleteQueryText += ` user_id = $${i+1}`;
            }
        };

        const deleteOrdersQuery = await pool.query(deleteQueryText, [...ids]);

        //finally, delete all non-admin users
        const deleteUsers = await pool.query(`delete from users where isadmin = false`, []);

        return true;
    }
    catch { return null; }
};

//CLEANUP -- DELETES ANY ADDED PRODUCTS EVERY TIME THE HEROKU DYNO SPINS UP
const deleteHerokuProducts = async () => {
    try {
        //delete the product bridge entities
        const deleteSizes = await pool.query(`
        delete from product_size
        where product_id > 73
        `, []);

        const deleteDetails = await pool.query(`
        delete from product_details 
        where product_id > 73
        `, []);

        const deleteProdImages = await pool.query(`
        delete from product_image
        where product_id > 73
        `, []);

        //clean up the image table
        const deleteImages = await pool.query(`
        delete from image where image_id > 193
        `, []);

        //delete product records
        const deleteProducts = await pool.query(`
        delete from product where product_id > 73
        `, []);

        return true;
    }
    catch { return null; }
};


module.exports = {
    getNavbarData,
    getProductSubcategories,
    getHomepageData,
    getPromoBannerData,
    getGenderPageData,
    getProductSizes,
    getProductsByCategory,
    getAllProducts,
    getProduct,
    addProduct,
    updateProduct,
    getCart,
    updateCart,
    deleteCart,
    addOrder,
    getOrders,
    getUserInfo,
    registerUser,
    loginUser,
    deleteUsers,
    deleteHerokuProducts
}