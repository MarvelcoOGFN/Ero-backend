const express = require("express");
const User = require('../model/user.js');
const Profile = require('../model/profiles.js'); 
const app = express(); 

const PORT = 3000;
const IP = '127.0.0.1'; 

app.use(express.json());

app.get('/api/vbucks', async (req, res) => {
    const { accountId, addValue, reason } = req.query;

    if (!accountId) {
        return res.status(400).json({ code: '400', error: 'Account ID not provided' });
    }
    if (!addValue) {
        return res.status(400).json({ code: '400', error: 'Add value not provided' });
    }
    if (!reason) {
        return res.status(400).json({ code: '400', error: 'Reason not provided' });
    }

    try {
   
        const user = await User.findOne({ accountId });
        if (user) {
            const username = user.username_lower; 

            if (reason === 'Kills') {
                await User.updateOne({ accountId }, { $inc: { statisticsKills: 1 } });
            } else if (reason === 'Wins') {
                await User.updateOne({ accountId }, { $inc: { statisticsWins: 1 } });
            }

            const filter = { accountId };
            const update = {
                $inc: { "profile.stats.attributes.current_mtx_platform": parseInt(addValue) }
            };
            const options = { new: true };
            const updatedProfile = await Profile.findOneAndUpdate(filter, update, options);

            if (updatedProfile) {
                const newQuantity = updatedProfile.profile.stats.attributes.current_mtx_platform.quantity;
                console.log(`Vbucks given to username ${username}, accountId ${accountId}, ${addValue}, ${reason}`);
                return res.status(200).json({ quantity: newQuantity });
            } else {
                return res.status(404).json({ code: '404', error: 'Profile not found or item not found.' });
            }
        } else {
            return res.status(404).json({ code: '404', error: 'User not found.' });
        }
    } catch (err) {
        return res.status(500).json({ code: '500', error: err.message });
    }
});

app.listen(PORT, IP, () => {
    console.log('\x1b[33m%s\x1b[0m', `Vbucks api is running on http://${IP}:${PORT}`);
}).on("error", async (err) => {
    if (err.code == "EADDRINUSE") {
        console.log(`Port ${PORT} is already in use!\nClosing in 3 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 3000)); 
        process.exit(0);
    } else {
        throw err;
    }
});

module.exports = app;
