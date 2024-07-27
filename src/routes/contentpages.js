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
    },
    playlistinformation: {
        frontend_matchmaking_header_style: "None",
        _title: "playlistinformation",
        frontend_matchmaking_header_text: "",
        playlist_info: {
            _type: "Playlist Information",
            playlists: [
                {
                    image: "https://cdn.discordapp.com/attachments/1266512692965806192/1266867522062385213/solo.png?ex=66a6b5d2&is=66a56452&hm=c8d3ebebec593d05ee33c01cd9a2695610d377c8c1121fdbfbe948a85753ee3f&",
                    playlist_name: "Playlist_DefaultSolo",
                    hidden: false,
                    special_border: "None",
                    _type: "FortPlaylistInfo"
                },
                {
                    image: "https://cdn.discordapp.com/attachments/1266512692965806192/1266868359425822780/duo.jpg?ex=66a6b69a&is=66a5651a&hm=b925287629caf31de769ee3477cfb3880f82bf4cbfbfbc828ed880d0b0dd85de&",
                    playlist_name: "Playlist_DefaultDuo",
                    hidden: false,
                    special_border: "None",
                    _type: "FortPlaylistInfo"
                },
                {
                    image: "https://cdn.discordapp.com/attachments/1266512692965806192/1266874720922632202/teamrumble.jpg?ex=66a6bc86&is=66a56b06&hm=2583f1009517f03c39df1dd3a3000795a6e61afe917fed1b99ec7eb31c09b4e0&",
                    playlist_name: "Playlist_Respawn_24",
                    hidden: false,
                    special_border: "None",
                    _type: "FortPlaylistInfo"
                },
                {
                    image: "https://cdn.discordapp.com/attachments/1266512692965806192/1266874428680179823/Creative.png?ex=66a6bc41&is=66a56ac1&hm=4069ef1dd70fda36301e328bba1c934a87450fc33c6e1b91364e10f4f5103203&",
                    playlist_name: "Playlist_PlaygroundV2",
                    hidden: false,
                    special_border: "None",
                    _type: "FortPlaylistInfo"
                },
                {
                    image: "https://cdn.discordapp.com/attachments/1266512692965806192/1266866440900710420/squads.png?ex=66a6b4d0&is=66a56350&hm=32541133a531584321e89f83c385f1ecf90d1b7b1898e64fda4a6158f5e37b01&",
                    playlist_name: "Playlist_DefaultSquad",
                    hidden: false,
                    special_border: "None",
                    _type: "FortPlaylistInfo"
                }
            ]
        },
        _noIndex: false,
        _activeDate: "2018-04-25T15:05:39.956Z",
        lastModified: "2019-10-29T14:05:17.030Z",
        _locale: "en-US"
    }
  });
});

module.exports = router;
