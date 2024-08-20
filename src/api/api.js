const bcrypt = require('bcrypt');
const express = require('express');
const User = require('../model/user.js');
const Profile = require('../model/profiles.js');
const axios = require('axios');
const cheerio = require('cheerio');
const itemshop = require('../structs/itemshop.js')
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 6666;
const IP = '45.145.41.189';

function sendData(handler) {
    return async function (req, res) {
        try {
            const result = await handler(req, res);
            if (!res.headersSent) {
                res.status(200).json(result);
            }
        } catch (error) {
            console.error('Internal Server Error:', error);
            if (!res.headersSent) {
                res.status(500).json({ error: "Internal Server Error" });
            }
        }
    };
}

app.get('/luna/battlepass', sendData(async (req, res) => {
    const { email } = req.query;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if user.profile and user.profile.stats are defined
        const battlepassTier = (user.profile && user.profile.stats) ? user.profile.stats.battlepassTier : 0;

        return { battlepassTier }; // No need to default to 0 explicitly here as it's already handled
    } catch (error) {
        console.error('Error fetching battlepass data:', error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}));



// Login
app.post('/luna/login', sendData(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ error: "Invalid Credentials" });
    }

    if (user.isBanned) { // Assuming 'isBanned' is a field in the user model
        return res.status(403).json({ error: "User is banned" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ error: "Invalid Credentials" });
    }


    await User.updateOne({ email }, { isLoggedIn: true });

    return { message: "Welcome", username: user.username };
}));

// Username
app.get('/luna/username', sendData(async (req, res) => {
    const { email } = req.query;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    return { username: user.username };
}));


app.get('/eon/vbucks/:accountId/:value', sendData(async (req, res) => {
    const { accountId, value } = req.params;

    // Validate input
    if (!accountId || isNaN(value)) {
        return { status: 400, message: "Invalid input" };
    }

    const numericValue = parseInt(value, 10);

    try {
        const userToUpdate = await User.findOne({ accountId });

        if (!userToUpdate) {
            return { status: 404, message: "User not found" };
        }

        const updatedUser = await User.updateOne(
            { accountId },
            { $inc: { "profile.stats.attributes.current_mtx_platform": numericValue } } // Use $inc to increment vbucks
        );

        if (updatedUser.modifiedCount > 0) {
            return { message: "Vbucks updated successfully" };
        } else {
            return { status: 400, message: "No changes made" };
        }
    } catch (error) {
        console.error('Internal Server Error:', error);
        throw error;
    }
}));

app.listen(PORT, IP, () => {
    console.log('\x1b[33m%s\x1b[0m', `API is running on http://${IP}:${PORT}`);
}).on("error", async (err) => {
    if (err.code === "EADDRINUSE") {
        console.log(`Port ${PORT} is already in use!\nClosing in 3 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        process.exit(1);
    } else {
        throw err;
    }
});

module.exports = app;
