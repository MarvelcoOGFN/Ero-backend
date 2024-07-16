const express = require("express");
const app = express();
const mongoose = require("mongoose");
const fs = require("fs");
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const error = require("./src/structs/errorModule.js");
const functions = require("./src/structs/functions.js");

dotenv.config(); 

const PORT = 3551;

const initializeApp = () => {
    setupDirectories();
    initializeSecret();
    cleanExpiredTokens();
    connectToMongoDB();
    setupMiddleware();
    loadRoutes();
    startServer();
};


const setupDirectories = () => {
    if (!fs.existsSync("./src/ClientSettings")) fs.mkdirSync("./src/ClientSettings");
};

const initializeSecret = () => {
    global.JWT_SECRET = functions.MakeID();
};

const cleanExpiredTokens = () => {
    const tokens = JSON.parse(fs.readFileSync("./src/token/tokens.json").toString());

    for (let tokenType in tokens) {
        tokens[tokenType] = tokens[tokenType].filter(token => {
            let decodedToken = jwt.decode(token.token.replace("eg1~", ""));
            return DateAddHours(new Date(decodedToken.creation_date), decodedToken.hours_expire).getTime() > new Date().getTime();
        });
    }

    fs.writeFileSync("./src/token/tokens.json", JSON.stringify(tokens, null, 2));

    global.accessTokens = tokens.accessTokens;
    global.refreshTokens = tokens.refreshTokens;
    global.clientTokens = tokens.clientTokens;

    global.exchangeCodes = [];
};

const connectToMongoDB = () => {
    mongoose.connect(process.env.MONGODB_DATABASE, () => {
        console.log('\x1b[33m%s\x1b[0m',"Agency connected to MongoDB");
    });

    mongoose.connection.on("error", err => {
        console.log("MongoDB failed to connect");
        throw err;
    });
};

const setupMiddleware = () => {
    app.use(rateLimit({ windowMs: 0.5 * 60 * 1000, max: 45 }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
};

const loadRoutes = () => {
    fs.readdirSync("./src/routes").forEach(fileName => {
        app.use(require(`./src/routes/${fileName}`));
    });
};

const startServer = () => {
    app.listen(PORT, () => {
        console.log('\x1b[33m%s\x1b[0m',"Agency started on port", PORT);
        require("./src/connections/xmpp.js");
        require("./src/Discord");
    }).on("error", async (err) => {
        if (err.code == "EADDRINUSE") {
            console.log(`Port ${PORT} is already in use!\nClosing in 3 seconds...`);
            await functions.sleep(3000);
            process.exit(0);
        } else throw err;
    });

    app.use((req, res, next) => {
        error.createError(
            "errors.com.epicgames.common.not_found",
            "Sorry, the resource you were trying to find could not be found",
            undefined, 1004, undefined, 404, res
        );
    });
};

const DateAddHours = (pdate, number) => {
    let date = new Date(pdate);
    date.setHours(date.getHours() + number);
    return date;
};

// Initialize the app
initializeApp();

