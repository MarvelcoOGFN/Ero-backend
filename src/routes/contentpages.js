const express = require('express');
const router = express.Router();
const functions = require('../structs/functions.js');

router.get('/content/api/pages/*', async (req, res) => {
  const contentPages = functions.getContentPages(req);
  const date = new Date();

  res.json({
    _title: 'Fortnite Game',
    _activeDate: date.toISOString(),
    lastModified: date.toISOString(),
    _locale: 'en-US',
    battleroyalenews: {
        news: {
            motds: [
                {
                    entryType: "Website",
                    image: "https://cdn.discordapp.com/attachments/1266512692965806192/1266512999494193298/fortnite-chapter-2-season-2-battle-pass-skins-uhdpaper.png?ex=66a61465&is=66a4c2e5&hm=2ef26aec6729a685c4197d2fa148068330008cb3329b4dac5a5d27a78e8fda70&",
                    tileImage: "https://cdn.discordapp.com/attachments/1266512692965806192/1266819822801387651/fortnite-chapter-2-season-2-battle-pass-skins-uhdpaper.com-4K-5.1880_2.jpg?ex=66a68966&is=66a537e6&hm=8014c743453b6471ba163e9b89e6ef04b160b49aacac996fc856469b8dcede27&",
                    hidden: false,
                    tabTitleOverride: "Climb Fn",
                    _type: "CommonUI Simple Message MOTD",
                    title: "Welcome To Climb Fn",
                    body: "Play Chapter 2 Season 2 again with Climb Fn",
                    videoStreamingEnabled: false,
                    sortingPriority: 20,
                    id: "News",
                    videoFullscreen: false,
                    spotlight: false,
                    websiteURL: "https://discord.gg/ggKCZhsBqg",
                    websiteButtonText: "Join our discord"
                }
            ]
        },
        "jcr:isCheckedOut": true,
        _title: "battleroyalenews",
        header: "",
        style: "None",
        _noIndex: false,
        alwaysShow: false,
        "jcr:baseVersion": "a7ca237317f1e74e4b8154-226a-4450-a3cd-c77af841e798",
        _activeDate: date.toISOString(),
        lastModified: date.toISOString(),
        _locale: "en-US"
    },
    emergencynotice: {
        news: {
            platform_messages: [],
            _type: 'Battle Royale News',
            messages: [
                {
                    hidden: false,
                    _type: 'CommonUI Simple Message Base',
                    subgame: 'br',
                    title: "Welcome To Climb Fn !",
                    body: "Enjoy Climb Fn by Marvelco and Mxrc3l\nif you run into bugs please report them\nin the discord!                                            ",
                    spotlight: true
                }
            ]
        },
        _title: 'emergencynotice',
        _activeDate: date.toISOString(),
        lastModified: date.toISOString(),
        _locale: 'en-US'
    }
  });
});

module.exports = router;
