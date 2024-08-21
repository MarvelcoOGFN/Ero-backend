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


// Launcher Version

app.get("/luna/version", (req, res) => {
    res.status(200).json({
        version: "1.0"
    });
});


// Skin

app.get("/luna/skin", sendData(async (req, res) => {
    const { discordId  } = req.query;
    // this took about an hour to figure out :sob:
    if (!discordId ) {
        return res.status(400).send("discordId  is required");
    }

    const user = await User.findOne({ discordId  });

    if (!user) {
        return res.status(404).json({ error: "user not found" });
    }

    const accountId = user.accountId;

    if (!accountId) {
        return res.status(400).json({ error: "id not found for user" });
    }

    const profile = await Profiles.findOne({ accountId });

    if (!profile) {
        return res.status(404).json({ error: "profile not found" });
    }

    const playercid = profiles.athena.items.LunaMP.attributes.locker_slots_data.slots.Character.items;

    let cid;
    if (!playercid) {
        cid = "CID_088_Athena_Commando_M_SpaceBlack";
    } else {
        cid = playercid.replace('AthenaCharacter:', '');
    }

    try {
        const response = await axios.get(`https://fortnite-api.com/v2/cosmetics/br/${cid}`);
        const iconUrl = response.data.data.images.icon;
        log.launcher(`Icon url thingy: ${iconUrl}`)
        if (!iconUrl) {
            console.error("icon not found");
            return res.status(404).json({ error: "icon aint found" });
        }

        return res.json(iconUrl);
    } catch (error) {
        log.launcher(`failed: ${error.message}`);
        return res.status(500).json({ error: "Fortnite" });
    }
}));

// Discord Avatar

app.get("/luna/avatar", async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).send("Email is required");
        }

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Extract discordId and avatar URL
        const { discordId, avatar } = user;

        if (!avatar) {
            return res.status(404).json({ error: "Avatar not found" });
        }

        log.launcher(`Getting avatar ${avatar} for ${discordId}`);

        return res.json({ discordId, avatar });
    } catch (error) {
        console.error(`Exception: ${error.message}`);
        return res.status(500).send("Internal Server Error");
    }
});


// Login

app.get('/luna/Login', async (req, res) => {
    const { token } = req.query;

    try {
        const user = await User.findOne({ token });

        if (!user) {
            return res.status(500).json({ error: "Its an invalid token lmao" });
        }

        return res.status(200).send();
    } catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
});


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

// vBucks might not work lmao

app.get("/luna/vbucks", sendData(async (req, res) => {
    const { discordId } = req.query;

    if (!discordId) {
        return res.status(400).send("id is required");
    }

    const user = await User.findOne({ discordId });

    if (!user) {
        return res.status(404).json({ error: "user not found" });
    }

    const profile = await Profiles.findOne({ accountId: user.accountId });

    if (!profile) {
        return res.status(404).json({ error: "cannot find profile" });
    }

    const items = profile && profile.profiles && profile.profiles.common_core && profile.profiles.common_core.athena && profile.profiles.common_core.athena.items;
    const vbucksBalance = items && items["Currency:MtxPurchased"] && items["Currency:MtxPurchased"].quantity || 0;

    console.log(`grrrr: ${vbucksBalance}`);

    res.json(vbucksBalance);
}));

// Exchange Code

app.get("/luna/fetch/exchange_code", async (req, res) => {
    const { discordId } = req.query;

    console.log(`trying to authenticate this discordid ${discordId}`);

    try {

        const user = await User.findOne({ discordId }).lean();

        if (!user) {
            console.log(`Cannot find user.`);
            return res.status(404).send;
        }


        console.log(`auth seems to have worked for ${discordId}`);

        let exchange_code = functions.MakeID().replace(/-/ig, "");

        global.exchangeCodes.push({
            accountId: user.accountId,
            exchange_code: exchange_code,
            creatingClientId: ""
        });

        setTimeout(() => {
            let exchangeCodeIndex = global.exchangeCodes.findIndex(i => i.exchange_code == exchange_code);
            if (exchangeCodeIndex != -1) global.exchangeCodes.splice(exchangeCodeIndex, 1);
        }, 300000);

        res.status(200).send(exchange_code);
    } catch (error) {
        console.error(`issues with discordid: ${discordId}`, error);
        res.status(500).send("skrrrrr pow");
    }
});

// News (HOLY MOLY)

app.get("/luna/testing/news1", sendData(async (req, res) => {
    const newsContent = {
        header: "Luna Multiplayer",
        date: "2024-08-21",
        desc: "Hi there and welcome to Luna Multiplayer! We host Chapter 2 Season 2 (Build 12.41). we are currently in a testing phase."
    };

    return newsContent;
}));

app.get("/luna/testing/news2", sendData(async (req, res) => {
    const newsContent = {
        header: "Version 1.0",
        date: "2024-08-21",
        desc: "Please note that we are still in the testing Phase and didnt release a stable version yet!"
    };

    return newsContent;
}));

app.get("/luna/testing/news3", sendData(async (req, res) => {
    const newsContent = {
        header: "BattlePass",
        date: "2024-08-21",
        desc: "Do you want the BattlePass? then get it for 950vBucks!"
    };
// this is taking 15 years
    return newsContent;
}));

// Some Discord Shit

app.get('/luna/getDCID', async (req, res) => {
    const { token } = req.query;

    try {
        const user = await User.findOne({ token });

        if (!user) {
            return res.status(404).json({ error: "error lol" });
        }

        return res.status(200).json(user.discordId);
    } catch (error) {
        return res.status(500).json({ error: "server error" });
    }
});


// Username

app.get("/luna/username", sendData(async (req, res) => {
    const { discordId } = req.query;
// Thats a medium rare stake btw
    if (!discordId) {
        return res.status(400).send("Discord ID is required");
    }

    const user = await User.findOne({ discordId });

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    return user.username;
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
