const bcrypt = require("bcrypt");


const User = require('../model/user.js');
const Profile = require('../model/profiles.js');
const Friends = require('../model/friends.js');
const profileManager = require('../structs/profile.js');
const id = require('./uuid');

async function registerUser(discordId, username, email, plainPassword) {
    email = email.toLowerCase();

    if (!discordId || !username || !email || !plainPassword) return { message: "Username/email/password is required.", status: 400 };

    if (await User.findOne({ discordId })) return { message: "You already created an account!", status: 400 };

    const accountId = id.MakeID().replace(/-/ig, "");

    // filters
    const emailFilter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!emailFilter.test(email)) return { message: "You did not provide a valid email address!", status: 400 };
    if (username.length >= 25) return { message: "Your username must be less than 25 characters long.", status: 400 };
    if (username.length < 3) return { message: "Your username must be at least 3 characters long.", status: 400 };
    if (plainPassword.length >= 128) return { message: "Your password must be less than 128 characters long.", status: 400 };
    if (plainPassword.length < 8) return { message: "Your password must be at least 8 characters long.", status: 400 };

    const allowedCharacters = (" !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~").split("");
    
    for (let character of username) {
        if (!allowedCharacters.includes(character)) return { message: "Your username has special characters, please remove them and try again.", status: 400 };
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    try {
        await User.create({ created: new Date().toISOString(), discordId, accountId, username, username_lower: username.toLowerCase(), email, password: hashedPassword }).then(async (i) => {
            try {
                await Profile.create({ created: i.created, accountId: i.accountId, profiles: profileManager.createProfiles(i.accountId) });
            } catch (profileErr) {
                console.error("Profile creation error:", profileErr);
                throw profileErr;
            }

            try {
                await Friends.create({ created: i.created, accountId: i.accountId });
            } catch (friendsErr) {
                console.error("Friends creation error:", friendsErr);
                throw friendsErr;
            }
        });
    } catch (err) {
        if (err.code == 11000) return { message: "Username or email is already in use.", status: 400 };

        console.error("Registration error:", err);
        return { message: "An unknown error has occurred, please try again later.", status: 400 };
    };

    return { message: `Successfully created an account with the username ${username}`, status: 200 };
}

module.exports = {
    registerUser,
}