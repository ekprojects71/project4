const router = require("express").Router();
const queries = require("../db/queries");

//GET requests
router.get("/navbar", async (req, res) => {
    const data = await queries.getNavbarData();

    if(data) {
        res.status(200).json(data);
    }
    else {
        res.status(503).send("Database currently unavailabe");
    }
});

router.get("/promo", async (req, res) => {
    const data = await queries.getPromoBannerData();

    if(data) {
        res.status(200).json(data);
    }
    else {
        res.status(503).send("Database currently unavailabe");
    }
});

router.get("/homepage", async (req, res) => {
    const data = await queries.getHomepageData();

    if(data) {
        res.status(200).json(data);
    }
    else {
        res.status(503).send("Database currently unavailabe");
    }
});

router.get("/gender-page/:gender", async (req, res) => {

    const gender = req.params.gender.toLowerCase();

    let data = null;

    switch(gender) {
        case "woman":
            data = await queries.getGenderPageData(3);
            break;
        case "man":
            data = await queries.getGenderPageData(4);
            break;
        default:
            res.status(404).send("That page does not exist");
    }

    if(data) {
        res.status(200).json(data);
    }
    else {
        res.status(503).send("Database currently unavailabe");
    }
});

router.get("/products/sizes", async (req, res) => {
    const data = await queries.getProductSizes();

    if(data) {
        res.status(200).json(data);
    }
    else {
        res.status(503).send("Database currently unavailabe");
    }
});

router.get("/products/subcategories", async (req, res) => {
    const data = await queries.getProductSubcategories();

    if(data) {
        res.status(200).json(data);
    }
    else {
        res.status(503).send("Database currently unavailabe");
    }
});

router.get("/products/gallery/:category", async (req, res) => {
    if(!req.params.category) {
        return res.status(404).json({error: "Invalid request"});
    }
    const { gender, category, subcategory } = JSON.parse(req.params.category);

    const data = await queries.getProductsByCategory(gender, category, subcategory);

    if(data) {
        res.status(200).json(data);
    }
    else {
        res.status(503).send("Database currently unavailabe");
    }
});

router.get("/products/product/:productCode", async (req, res) => {
    if(!req.params.productCode) {
        return res.status(404).json({error: "Invalid request"});
    }

    const data = await queries.getProduct(req.params.productCode);

    if(data) {
        res.status(200).json(data);
    }
    else {
        res.status(503).send("Database currently unavailabe");
    }
});

router.get("/products/all-products", async (req, res) => {
    const data = await queries.getAllProducts();

    if(data) {
        res.status(200).json(data);
    }
    else {
        res.status(503).send("Database currently unavailabe");
    }
});

router.get("/shopping-cart", async (req, res) => {
    if(req.session.user) {

        const data = await queries.getCart(req.session.user.accountNumber);

        if(data) {
            res.status(200).json(data);
        }
        else {
            res.status(503).send("Database currently unavailabe");
        }
    }
    else {
        res.status(403).json( {message: "You must be logged in to do that."} );
    }
});

router.get("/user/orders", async (req, res) => {
    if(req.session.user) {

        const data = await queries.getOrders(req.session.user.accountNumber);

        if(data) {
            res.status(200).json(data);
        }
        else {
            res.status(503).send("Database currently unavailabe");
        }
    }
    else {
        res.status(403).json( {message: "You must be logged in to do that."} );
    }
});

router.get("/user/user-info", async (req, res) => {
    if(req.session.user) {

        const data = await queries.getUserInfo(req.session.user.accountNumber);

        if(data) {
            res.status(200).json(data);
        }
        else {
            res.status(503).send("Database currently unavailabe");
        }
    }
    else {
        res.status(403).json( {message: "You must be logged in to do that."} );
    }
});


//POST requests
router.post("/shopping-cart", async (req, res) => {
    if(req.session.user) {
        const cart = JSON.stringify(req.body);

        const data = await queries.updateCart(req.session.user.accountNumber, cart);

        if(data) {
            res.status(200).json(data);
        }
        else {
            res.status(503).send("Database currently unavailabe");
        }
    }
    else {
        res.status(403).json( {message: "You must be logged in to do that."} );
    }
});

router.post("/user/orders", async (req, res) => {
    if(req.session.user) {
        const order = JSON.stringify(req.body);

        const data = await queries.addOrder(req.session.user.accountNumber, order);

        if(data) {
            res.status(200).json(data);
        }
        else {
            res.status(503).send("Database currently unavailabe");
        }
    }
    else {
        res.status(403).json( {message: "You must be logged in to do that."} );
    }
});


//DELETE requests
router.delete("/shopping-cart", async (req, res) => {
    if(req.session.user) {

        const data = await queries.deleteCart(req.session.user.accountNumber);

        if(data) {
            res.status(200).json(data);
        }
        else {
            res.status(503).send("Database currently unavailabe");
        }
    }
    else {
        res.status(403).json( {message: "You must be logged in to do that."} );
    }
});

module.exports = router;