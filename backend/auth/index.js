const router = require("express").Router();
const queries = require("../db/queries");

//auth middleware
const checkLoggedIn = (req, res, next) => {
    if(req.session.user) {
        res.status(403).send("Already Logged In");
    }
    else {
        next();
    }
};
const checkLoggedOut = (req, res, next) => {
    if(!req.session.user) {
        res.status(403).send("Already Logged Out.");
    }
    else {
        next();
    }
};


//auth routes
router.post("/register", async (req, res) => {
    let user = req.body;
    user.zipcode = user.zipcode.toString();
    const errors = [];
    const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    const password = user.password; //this stores the pw pre-encryption

    //input validation
    if(user.email.length === 0 && !user.email.includes("@")) {
        errors.push("Please enter a valid email address.");
    }
    if(user.email.length > 100) {
        errors.push("Your email address is too long. Email cannot exceed 100 characters.");
    }
    if(!user.password.match(pwRegex)) {
        errors.push("Your password is not strong enough.");
    }
    if(user.password.length > 20) {
        errors.push("Your password is too long. Password cannot exceed 20 characters.");
    }
    if(user.firstName.length === 0) {
        errors.push("Please enter your first name.");
    }
    if(user.firstName.length > 50) {
        errors.push("First name cannot exceed 50 characters.");
    }
    if(user.lastName.length === 0) {
        errors.push("Please enter your last name.");
    }
    if(user.lastName.length > 50) {
        errors.push("First name cannot exceed 50 characters.");
    }
    if(user.streetAddress.length === 0) {
        errors.push("Please enter your street address.");
    }
    if(user.streetAddress.length > 150) {
        errors.push("Street address cannot exceed 150 characters.");
    }
    if(user.city.length === 0) {
        errors.push("Please enter your city.");
    }
    if(user.city.length > 100) {
        errors.push("City cannot exceed 100 characters.");
    }
    if(!user.state) {
        errors.push("Please select your state.");
    }
    if(user.zipcode > 99999 || user.zipcode < 10000) {
        errors.push("Please enter a valid zipcode.");
    }

    //send validation errors to client
    if(errors.length > 0) {
        return res.status(422).json({ errors: errors });
    }

    //register user - insert account in DB
    const data = await queries.registerUser(user);
    if(!data) {
        errors.push("There was a problem registering your account. Please try again later.");
        return res.status(500).json({ errors: errors });
    }
    else if (data === 1) {
        errors.push("That email is already taken.");
        return res.status(401).json({ errors: errors });
    }
    
    try{
        //create user session, sign them in
        req.session.user = await queries.loginUser(data.user_email, password);
    }
    catch {
        return res.status(503).send("Unexpected Server Error");
    }
    
    res.status(200).json({ message: "Account successfully registered." });
});


router.post("/login", checkLoggedIn, async (req, res) => {
    const user = req.body;
    const errors = [];
    
    const data = await queries.loginUser(user.email, user.password);
    if(!data) {
        errors.push("Invalid Credentials. Please check your email or password.");
        return res.status(401).json({ errors: errors });
    }

    try {
        //create user session, sign them in
        req.session.user = data;
    }
    catch {
        return res.status(503).send("Unexpected Server Error");
    }

    res.status(200).json({ message: "Login was successful." });
});


router.post("/logout", checkLoggedOut, (req, res) => {
    //Terminate User Session
    req.session.destroy((err) => {
        if(err) {
            return res.status(500).json({ message: "There was a problem logging out." });
        }
    });

    res.clearCookie("SESSION");

    res.status(200).json({ message: "Successfully logged out." });
});


router.get("/validate", (req, res) => {

    if(req.session.user) {
        return res.status(200).json({ status: true });
    }
    else {
        return res.status(403).json({ status: false });
    }
});


module.exports = router;