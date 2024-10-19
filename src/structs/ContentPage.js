const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const Version = require("../structs/Versioninfo.js");


function ContentPages(req) {
    const memory = Version.GetVersionInfo(req);
    let season = memory.season;
    let version = memory.build;

    let contentpages;

    if (season === 11) {
        if (version === 11.31) {
            contentpages = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "shop", "contentpages", "winter19.json")).toString());
        } 
        else
        {
            contentpages = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "shop", "contentpages", `s11.json`)).toString());
        }
    } 
    else
    {
        contentpages = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "shop", "contentpages", `s${season}.json`)).toString());
    }

    let Language = "en";

    try {
        if (req.headers["accept-language"]) {
            if (req.headers["accept-language"].includes("-") && req.headers["accept-language"] != "es-419") {
                Language = req.headers["accept-language"].split("-")[0];
            } else {
                Language = req.headers["accept-language"];
            }
        }
    } catch {}

    const modes = ["saveTheWorldUnowned", "battleRoyale", "creative", "saveTheWorld"];

    try {
        modes.forEach(mode => {
            contentpages.subgameselectdata[mode].message.title = contentpages.subgameselectdata[mode].message.title[Language];
            contentpages.subgameselectdata[mode].message.body = contentpages.subgameselectdata[mode].message.body[Language];
        });
    } catch {}

    return contentpages;
}

module.exports = {
    ContentPages
};
