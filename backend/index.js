/*
    Package Imports & Setup
*/
//express app
const express = require("express");
const app = express();
require("dotenv").config();
const path = require("path");

//session & db
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const pool = require("./db/index.js");
const queries = require("./db/queries.js");
const crypto = require("crypto");


//image processing
const sharp = require("sharp");
const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images/fashion");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if(file.mimetype === "image/jpeg") {
        cb(null, true); //store the file
    }
    else {
        cb(null, false); //reject the file
    }
};
const upload = multer({
    storage: storage,
    //1.5mb filesize limit
    limits: { fileSize: 1024 * 1024 * 1.5 },
    fileFilter : fileFilter
}).array('files', 12);


//CORS - for testing purposes only 
//const cors = require("cors");
//app.use(cors());

/*
    Middleware
*/

//static folders
app.use("/", express.static("public"));

//body parsing
app.use(express.json());
app.use(express.urlencoded( {extended: false} ));

//session middleware, config cookie
const SECRET = crypto.randomBytes(64).toString('hex');

app.use(session({
    name: "SESSION",
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new pgSession({
        pool: pool
    }),
    cookie: {
        path: "/",
        maxAge: 1000 * 60 * 25, //deleted after 25 mins of inactivity
        httpOnly: true,
        secure: false,
        sameSite: true,
    }
}));


//Auth middleware
const checkSession = (req, res, next) => {
    if(!req.session.user) {
        res.status(403).send("Not authorized.");
    }
    else {
        next();
    }
};
const checkCreds = (req, res, next) => {
    if(!req.session.user.isAdmin) {
        res.status(403).send("Not authorized.");
    }
    else {
        next();
    }
};

//delete non-admins every time the server "wakes up" - since this is a herokuapp
//cleans up any products that were added or edited
try {
    queries.deleteUsers();
    queries.deleteHerokuProducts();
}
catch {
    console.log("Could not delete users or clean up products");
}


//Routes and API
const api = require("./api/index");
app.use("/api", api);

const auth = require("./auth/index");
app.use("/auth", auth);



/*
    SERVING THE FRONT-END
*/
app.use(express.static(path.join(__dirname, "dist")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});



//uploads
app.post("/uploads/product", checkSession, checkCreds, upload, async (req, res) => {
    let product = req.body;
    product.gender = parseInt(product.gender);
    product.price = parseFloat(product.price);
    let { sizes } = JSON.parse(product.sizes);
    product.sizes = sizes;

    let photos = req.files;
    let filepaths = [];
    let errors = [];

    photos.forEach(photo => {
        filepaths.push(photo.path);
    })

    //validate the form data
    if(product.productName.length > 75) {
        errors.push("Product name cannot exceed 200 characters");
    }
    if(product.description.length > 200) {
        errors.push("Description cannot exceed 200 characters");
    }
    if(product.detail1.length > 100 ||
        product.detail2.length > 100 ||
        product.detail2.length > 100) {
        errors.push("Product details cannot exceed 100 characters");  
    }
    if(product.price > 99999.99) {
        errors.push("Price cannot exceed $99999.99");
    }
    if(product.gender != 0 && product.gender != 1) {
        errors.push("Gender option is invalid. Please use the radio buttons to set the gender");
    }
    if(photos.length === 0) {
        errors.push("You must upload images with the product data");
    }
    photos.forEach(photo => {
        if(photo.mimetype !== "image/jpeg") {
            errors.push("Invalid filetype: Images may only be in jpeg format");
            return res.status(422).json({errors: errors});
        }
    })

    if(errors.length > 0) {
        return res.status(422).json({errors: errors});
    }

    //insert the product in the database
    const data = await queries.addProduct(product, filepaths);
    if(!data) {
        errors.push("Server Error: could not upload product, please try again later.");
        return res.status(503).json({errors: errors});
    }

    //store the images, and create medium & small versions with sharp
    filepaths.forEach(path => {
        let medium = `${path.substring(0, path.length - 4)}_m${path.substring(path.length - 4, path.length)}`;
        let small = `${path.substring(0, path.length - 4)}_s${path.substring(path.length - 4, path.length)}`;
        
        sharp(path)
            .resize({width: 250})
            .toFile(small);
        
        sharp(path)
            .resize({width: 800})
            .toFile(medium);
    });
    
    res.status(200).json({message: `${product.productName} successfully uploaded.`});
});

app.put("/uploads/product", checkSession, checkCreds, upload, async (req, res) => {
    let product = req.body;
    product.gender = parseInt(product.gender);
    product.price = parseFloat(product.price);
    let { sizes } = JSON.parse(product.sizes);
    let { markedImages } = JSON.parse(product.markedImages);
    product.sizes = sizes;
    product.markedImages = markedImages;

    let photos = req.files;
    let filepaths = [];
    let errors = [];

    if(photos.length > 0) {
        photos.forEach(photo => {
            filepaths.push(photo.path);
        })    
    }

    //validate the form data
    if(product.productName.length > 75) {
        errors.push("Product name cannot exceed 200 characters");
    }
    if(product.description.length > 200) {
        errors.push("Description cannot exceed 200 characters");
    }
    if(product.detail1.length > 100 ||
        product.detail2.length > 100 ||
        product.detail2.length > 100) {
        errors.push("Product details cannot exceed 100 characters");  
    }
    if(product.price > 99999.99) {
        errors.push("Price cannot exceed $99999.99");
    }
    if(product.gender != 0 && product.gender != 1) {
        errors.push("Gender option is invalid. Please use the radio buttons to set the gender");
    }
    photos.forEach(photo => {
        if(photo.mimetype !== "image/jpeg") {
            errors.push("Invalid filetype: Images may only be in jpeg format");
            return res.status(422).json({errors: errors});
        }
    })

    if(errors.length > 0) {
        return res.status(422).json({errors: errors});
    }
    

    //insert the product in the database
    const data = await queries.updateProduct(product, filepaths);
    if(!data) {
        errors.push("Server Error: could not upload product, please try again later.");
        return res.status(503).json({errors: errors});
    }
    
    if(photos.length > 0) {
        //store the images, and create medium & small versions with sharp
        filepaths.forEach(path => {
            let medium = `${path.substring(0, path.length - 4)}_m${path.substring(path.length - 4, path.length)}`;
            let small = `${path.substring(0, path.length - 4)}_s${path.substring(path.length - 4, path.length)}`;
            
            sharp(path)
                .resize({width: 250})
                .toFile(small);
            
            sharp(path)
                .resize({width: 800})
                .toFile(medium);
        });    
    }
    
    res.status(200).json({message: `${product.productName} successfully updated.`});
});




//launch the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
})