const express = require('express');
const router = express.Router();

router.get('/content/api/pages/*', async (req, res) => {
  const date = new Date();

  res.json({
    _title: 'Fortnite Game',
    _activeDate: date.toISOString(),
    lastModified: date.toISOString(),
    _locale: 'en-US',
    dynamicbackgrounds: {
      backgrounds: {
        backgrounds: [
          {
            stage: `season12`,
            _type: "DynamicBackground",
            key: "lobby",
          },
        ],
        _type: "DynamicBackgroundList",
      },
      _title: "dynamicbackgrounds",
      _noIndex: false,
      _activeDate: "date.toISOString()",
      lastModified: "date.toISOString()",
      _locale: "en-US",
      _templateName: "FortniteGameDynamicBackgrounds",
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
                    title: "Ero Backend!",
                    body: "Enjoy Ero backend created by marvelco and lawin.",
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
                    image: "https://i.imgur.com/H9KEZs0.png",
                    playlist_name: "Playlist_DefaultSolo",
                    hidden: false,
                    special_border: "None",
                    _type: "FortPlaylistInfo"
                },
                {
                    image: "https://i.imgur.com/Jmu2Y5Z.jpg",
                    playlist_name: "Playlist_DefaultDuo",
                    hidden: false,
                    special_border: "None",
                    _type: "FortPlaylistInfo"
                },
                {
                    image: "https://i.imgur.com/Hm17IwV.jpg",
                    playlist_name: "Playlist_Respawn_24",
                    hidden: false,
                    special_border: "None",
                    _type: "FortPlaylistInfo"
                },
                {
                    image: "https://i.imgur.com/046vkY9.png",
                    playlist_name: "Playlist_PlaygroundV2",
                    hidden: false,
                    special_border: "None",
                    _type: "FortPlaylistInfo"
                },
                {
                    image: "https://i.imgur.com/UN5pS91.png",
                    playlist_name: "Playlist_DefaultSquad",
                    hidden: false,
                    special_border: "None",
                    _type: "FortPlaylistInfo"
                },
                
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
