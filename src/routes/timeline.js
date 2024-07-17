const express = require("express");
const app = express.Router();
const { verifyToken, verifyClient } = require("../token/tokenVerify.js");
const functions = require("../structs/functions.js");

const getNewItemshopTime = () => {
    const now = new Date();
    now.setUTCDate(now.getUTCDate() + 1);
    now.setUTCHours(0, 0, 0, 0);
    return now.toISOString();
};

const ItemshopTime = getNewItemshopTime();

const createEvent = (eventType, activeUntil, activeSince) => ({
    eventType,
    activeUntil,
    activeSince
});


app.get("/fortnite/api/calendar/v1/timeline", (req, res) => {
    
    const memory = functions.GetVersionInfo(req);

    const activeEvents = [
        createEvent(`EventFlag.Season${memory.season}`, "9999-01-01T00:00:00.000Z", "2020-01-01T00:00:00.000Z"),
        createEvent(`EventFlag.${memory.lobby}`, "9999-01-01T00:00:00.000Z", "2020-01-01T00:00:00.000Z")
    ];

    const clientEventsState = {
        validFrom: "0001-01-01T00:00:00.000Z",
        activeEvents: activeEvents,
        state: {
            activeStorefronts: [],
            eventNamedWeights: {},
            seasonNumber: memory.season,
            seasonTemplateId: `AthenaSeason:athenaseason${memory.season}`,
            matchXpBonusPoints: 0,
            seasonBegin: "2020-01-01T00:00:00Z",
            seasonEnd: "9999-01-01T00:00:00Z",
            seasonDisplayedEnd: "9999-01-01T00:00:00Z",
            weeklyStoreEnd: ItemshopTime,
            stwEventStoreEnd: "9999-01-01T00:00:00.000Z",
            stwWeeklyStoreEnd: "9999-01-01T00:00:00.000Z",
            sectionStoreEnds: {
                Featured: ItemshopTime
            },
            dailyStoreEnd: ItemshopTime
        }
    };

    res.json({
        channels: {
            "client-matchmaking": {
                states: [],
                cacheExpire: "9999-01-01T00:00:00.000Z"
            },
            "client-events": {
                states: [clientEventsState],
                cacheExpire: "9999-01-01T00:00:00.000Z"
            }
        },
        eventsTimeOffsetHrs: 0,
        cacheIntervalMins: 10,
        currentTime: new Date().toISOString(),
        ItemshopTime: ItemshopTime 
    });
});

module.exports = app;
