"use strict";

const express = require("express");
const session = require("express-session");
const { check, validationResult } = require("express-validator");
const morgan = require("morgan");
const cors = require("cors");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const child_process = require("child_process");

const { SERVER_URL } = require("../constants.js");
const db_interface = require("./db_interface");

const corsOptions = { 
    origin: ["http://localhost:5173", "http://127.0.0.1:5173", `${SERVER_URL}:5173`], 
    credentials: true 
};

const os_manager = require("./os_manager");

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(cors(corsOptions));

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: app.get("env") === "production" ? true : false }
}))
app.use(passport.authenticate("session"));


// ---------------------------------------------------------------------------------------------------------------------
//----------------------------------------- Passport Configuration -----------------------------------------------------

passport.use(new LocalStrategy({ username: 'username', password: 'password' },
    async function verify(username, password, callback) {
        db_interface.login(username, password)
            .then((user) => {
                return callback(null, user);
            }).catch((err) => {
                return callback(null, false, err);
            });
    }
));

passport.serializeUser((user, callback) => {
    // console.log(user);
    callback(null, user);
});

passport.deserializeUser((user, callback) => {
    return db_interface.getUser(user.username)
    .then( (user) => {
        console.log(user);
        callback(null, user)})
    .catch( (err) => {callback(err, null)});
});

// ---------------------------------------------------------------------------------------------------------------------
//----------------------------------------- Login Utility Functions ----------------------------------------------------

const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    } else {
        res.status(401).json({error: "Unauthorized"});
    }
}

const isAdminLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        console.log(req.user);
        if (req.user.isAdmin){
        return next();
        } else {
            res.status(401).json({error: "Unauthorized"});
        }
    }
}

// ---------------------------------------------------------------------------------------------------------------------
//----------------------------------------- API Endpoints --------------------------------------------------------------

// ------- Login Endpoint -------
app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", {failureMessage: true}, (err, user, info) => {
        if(err){
            return next(err);
        }
        if(!user){
            return res.status(401).json({error: info});
        }
        req.login(user, (err) => {
            if(err){
                return next(err);
            }
            return res.json(req.user);
        });
    })(req, res, next);
});

// ------- Logout Endpoint -------
app.delete("/api/logout", isLoggedIn, (req, res) => {
    req.logout(()=>{
        res.status(200).json({message: "Logged out"});
    });
});


// ------- Stats Endpoint -------
app.get("/api/stats", isLoggedIn,  (req, res) => {
    // console.log("Richiesta di statistiche ricevuta");
    os_manager.getStats()
        .then((data) => {
            // console.log(data);
            res.json(data);
        }).catch((err) => {
            console.log(err);
            res.json(err);
        });
});

// ------- Processes Endpoint -------
app.get("/api/processes", isAdminLoggedIn, (req, res) => {
    // console.log("Richiesta di processi ricevuta");
    os_manager.getProcesses()
        .then((data) => {
            // console.log(data);
            res.json({ "array": data });
        }).catch((err) => {
            console.log(err);
            res.json(err);
        });
});


const PORT = 3001;
app.listen(PORT, () => {
    // try{
    //     db_interface
    // } catch(err){
    //     console.log(err);
        
    // }
    console.log(`Server in ascolto sulla porta ${PORT}`);
    // os_manager.getStats();
    // os_manager.getProcesses();
});