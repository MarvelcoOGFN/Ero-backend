const express = require("express");
const app = express();
const mongoose = require("mongoose");
const fs = require("fs");
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const error = require("./src/structs/errorModule.js");
const id = require("./src/structs/uuid.js");
const path = require("path");
const { spawn } = require('child_process');

dotenv.config();

const PORT = 3551;

const initializeApp = async () => {
    try {
        await generateItemshopConfig(); // Generate itemshop first
        setupDirectories();
        initializeSecret();
        cleanExpiredTokens();
        connectToMongoDB();
        setupMiddleware();
        loadRoutes();
        scheduleRestart(); 
        startServer();
    } catch (err) {
        console.error('Error initializing app:', err);
        process.exit(1); 
    }
};

  const generateItemshopConfig = async () => {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(__dirname, 'src' , "structs" ,'Itemshop.js');
        const child = spawn('node', [scriptPath]);

        child.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        child.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        child.on('close', (code) => {
            if (code === 0) {
                console.log('\x1b[33m%s\x1b[0m','itemshop generated successfully');
                resolve();
            } else {
                console.error(`Failed to generate itemshop.json (exit code ${code})`);
                reject(new Error(`Failed to generate itemshop.json (exit code ${code})`));
            }
        });
    });
}; 

const setupDirectories = () => {
    if (!fs.existsSync("./src/ClientSettings")) fs.mkdirSync("./src/ClientSettings");
};

const initializeSecret = () => {
    global.JWT_SECRET = id.MakeID();
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
        console.log('\x1b[33m%s\x1b[0m',"Ero Backend connected to MongoDB");
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
    const routesDir = path.join(__dirname, 'src', 'routes');
    fs.readdirSync(routesDir).forEach(fileName => {
        const routePath = path.join(routesDir, fileName);
        const routeModule = require(routePath);
        if (typeof routeModule === 'function') {
            app.use(routeModule);
        } else {
            console.error(`Error loading route ${fileName}: expected a middleware function but got ${typeof routeModule}`);
        }
    });
};

const getTime = () => {
    const now = new Date();
    let next = new Date(now);

    next.setHours(2, 0, 0, 0); 

    if (next <= now) {
        next.setDate(now.getDate() + 1);
    }

    return next - now;
};

const scheduleRestart = () => {
    const time = getTime();

    setTimeout(() => {
        console.log('\x1b[33m%s\x1b[0m',"Restarting");
        process.exit(0);
    }, time);
};

const startServer = () => {
    app.listen(PORT, () => {
        console.log('\x1b[33m%s\x1b[0m',"Ero Backend started on port", PORT);
        require("./src/connections/xmpp.js");
        require("./src/discord");
    }).on("error", async (err) => {
        if (err.code == "EADDRINUSE") {
            console.log(`Port ${PORT} is already in use!\nClosing in 3 seconds...`);
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
