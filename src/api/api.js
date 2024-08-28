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
const IP = '127.0.0.1';

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
