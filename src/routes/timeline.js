const express = require("express");
const app = express.Router();

const { verifyToken, verifyClient } = require("../token/tokenVerify.js");
const functions = require("../structs/functions.js");

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
            weeklyStoreEnd: "9999-01-01T00:00:00Z", //this doesnt matter because my backend doesnt support stw just there to bypass error
            stwEventStoreEnd: "9999-01-01T00:00:00.000Z", //this doesnt matter because my backend doesnt support stw just there to bypass error
            stwWeeklyStoreEnd: "9999-01-01T00:00:00.000Z", //this doesnt matter because my backend doesnt support stw just there to bypass error
            sectionStoreEnds: {
                Featured: "9999-12-31T23:59:59.999Z"
            },
            dailyStoreEnd: "9999-12-31T23:59:59.999Z"
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
                cacheExpire: "9999-01-01T00:00:00.000Z" //set to what you want
            }
        },
        eventsTimeOffsetHrs: 0,
        cacheIntervalMins: 10,
        currentTime: new Date().toISOString()
    });
});

module.exports = app;
