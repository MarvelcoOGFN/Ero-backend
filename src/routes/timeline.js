const express = require("express");
const app = express.Router();
const { verifyToken, verifyClient } = require("../token/tokenVerify.js");
const Version = require("../structs/Versioninfo.js");

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


app.get("/fortnite/api/calendar/v1/timeline", async (req, res) => {
    const memory = Version.GetVersionInfo(req);

    const activeEvents = [
        createEvent(`EventFlag.Season${memory.season}`, "9999-01-01T00:00:00.000Z", "2020-01-01T00:00:00.000Z"),
        createEvent(`EventFlag.${memory.lobby}`, "9999-01-01T00:00:00.000Z", "2020-01-01T00:00:00.000Z")
    ];

    if (memory.season == 3) {
        activeEvents.push(
        {
            "eventType": "EventFlag.Spring2018Phase1",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        })
        if (memory.build >= 3.1) {
            activeEvents.push(
            {
                "eventType": "EventFlag.Spring2018Phase2",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            })
        }
        if (memory.build >= 3.3) {
            activeEvents.push(
            {
                "eventType": "EventFlag.Spring2018Phase3",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            })
        }
        if (memory.build >= 3.4) {
            activeEvents.push(
            {
                "eventType": "EventFlag.Spring2018Phase4",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            })
        }
    }

    if (memory.season == 4) {
        activeEvents.push(
        {
            "eventType": "EventFlag.Blockbuster2018",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.Blockbuster2018Phase1",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        })
        if (memory.build >= 4.3) {
            activeEvents.push(
            {
                "eventType": "EventFlag.Blockbuster2018Phase2",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            })
        }
        if (memory.build >= 4.4) {
            activeEvents.push(
            {
                "eventType": "EventFlag.Blockbuster2018Phase3",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            })
        }
        if (memory.build >= 4.5) {
            activeEvents.push(
            {
                "eventType": "EventFlag.Blockbuster2018Phase4",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            })
        }
    }

    if (memory.season == 5) {
        activeEvents.push(
        {
            "eventType": "EventFlag.RoadTrip2018",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.Horde",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.Anniversary2018_BR",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTM_Heist",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        })
    }
    
    if (memory.build == 5.10) {
        activeEvents.push(
        {
            "eventType": "EventFlag.BirthdayBattleBus",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        })
    }

    if (memory.season == 6) {
        activeEvents.push(
        {
            "eventType": "EventFlag.LTM_Fortnitemares",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTM_LilKevin",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        })
        if (memory.build >= 6.20) {
            activeEvents.push(
            {
                "eventType": "EventFlag.Fortnitemares",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            },
            {
                "eventType": "EventFlag.FortnitemaresPhase1",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            },
            {
                "eventType": "POI0",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            })
        }
        if (memory.build >= 6.22) {
            activeEvents.push(
            {
                "eventType": "EventFlag.FortnitemaresPhase2",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            })
        }
    }
    
    if (memory.build == 6.20 || memory.build == 6.21) {
        activeEvents.push(
        {
            "eventType": "EventFlag.LobbySeason6Halloween",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.HalloweenBattleBus",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        })
    }

    if (memory.season == 7) {
        activeEvents.push(
        {
            "eventType": "EventFlag.Frostnite",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTM_14DaysOfFortnite",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTE_Festivus",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTM_WinterDeimos",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTE_S7_OverTime",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        })
    }

    if (memory.season == 8) {
        activeEvents.push(
        {
            "eventType": "EventFlag.Spring2019",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.Spring2019.Phase1",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTM_Ashton",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTM_Goose",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTM_HighStakes",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTE_BootyBay",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        })
        if (memory.build >= 8.2) {
            activeEvents.push(
            {
                "eventType": "EventFlag.Spring2019.Phase2",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            })
        }
    }


    if (memory.season == 9) {
        activeEvents.push(
        {
            "eventType": "EventFlag.Season9.Phase1",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.Anniversary2019_BR",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTM_14DaysOfSummer",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTM_Mash",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTM_Wax",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        })
        if (memory.build >= 9.2) {
            activeEvents.push(
            {
                "eventType": "EventFlag.Season9.Phase2",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            })
        }
    }

    if (memory.season == 10) {
        activeEvents.push(
        {
            "eventType": "EventFlag.Mayday",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.Season10.Phase2",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.Season10.Phase3",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTE_BlackMonday",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.S10_Oak",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.S10_Mystery",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        })
    }

    if (memory.season == 11) {
        activeEvents.push(
        {
            "eventType": "EventFlag.LTE_CoinCollectXP",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z" 
        },
        {
            "eventType": "EventFlag.LTE_Fortnitemares2019",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z" 
        },
        {
            "eventType": "EventFlag.LTE_Galileo_Feats",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z" 
        },
        {
            "eventType": "EventFlag.LTE_Galileo",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z" 
        },
        {
            "eventType": "EventFlag.LTE_WinterFest2019",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        })

        if (memory.build >= 11.2) {
            activeEvents.push(
            {
                "eventType": "EventFlag.Starlight",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z" 
            })
        }

        if (memory.build < 11.3) {
            activeEvents.push(
            {
                "eventType": "EventFlag.Season11.Fortnitemares.Quests.Phase1",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z" 
            },
            {
                "eventType": "EventFlag.Season11.Fortnitemares.Quests.Phase2",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z" 
            },
            {
                "eventType": "EventFlag.Season11.Fortnitemares.Quests.Phase3",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z" 
            },
            {
                "eventType": "EventFlag.Season11.Fortnitemares.Quests.Phase4",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z" 
            },
            {
                "eventType": "EventFlag.StormKing.Landmark",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z" 
            })
        } else {
            activeEvents.push(
            {
                "eventType": "EventFlag.HolidayDeco",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            },
            {
                "eventType": "EventFlag.Season11.WinterFest.Quests.Phase1",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            },
            {
                "eventType": "EventFlag.Season11.WinterFest.Quests.Phase2",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            },
            {
                "eventType": "EventFlag.Season11.WinterFest.Quests.Phase3",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            },
            {
                "eventType": "EventFlag.Season11.Frostnite",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            })
        }

        if (memory.build == 11.31 || memory.build == 11.40) {
            activeEvents.push(
            {
                "eventType": "EventFlag.Winterfest.Tree",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            },
            {
                "eventType": "EventFlag.LTE_WinterFest",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            },
            {
                "eventType": "EventFlag.LTE_WinterFest2019",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            })
        }
    }

    if (memory.season == 12) {
        activeEvents.push(
        {
            "eventType": "EventFlag.LTE_SpyGames",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTE_JerkyChallenges",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTE_Oro",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTE_StormTheAgency",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        })
    }

    if (memory.season == 14) {
        activeEvents.push(
        {
            "eventType": "EventFlag.LTE_Fortnitemares_2020",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        })
    }

    if (memory.season == 15) {
        activeEvents.push(
        {
            "eventType": "EventFlag.LTQ_S15_Legendary_Week_01",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTQ_S15_Legendary_Week_02",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTQ_S15_Legendary_Week_03",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTQ_S15_Legendary_Week_04",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTQ_S15_Legendary_Week_05",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTQ_S15_Legendary_Week_06",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTQ_S15_Legendary_Week_07",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTQ_S15_Legendary_Week_08",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTQ_S15_Legendary_Week_09",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTQ_S15_Legendary_Week_10",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTQ_S15_Legendary_Week_11",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTQ_S15_Legendary_Week_12",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTQ_S15_Legendary_Week_13",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTQ_S15_Legendary_Week_14",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTQ_S15_Legendary_Week_15",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.Event_HiddenRole",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.Event_OperationSnowdown",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.Event_PlumRetro",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        })
    }

    if (memory.season == 16) {
        activeEvents.push(
        {
            "eventType": "EventFlag.LTQ_S16_Legendary_Week_01",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTQ_S16_Legendary_Week_02",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTQ_S16_Legendary_Week_03",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTQ_S16_Legendary_Week_04",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTQ_S16_Legendary_Week_05",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTQ_S16_Legendary_Week_06",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTQ_S16_Legendary_Week_07",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTQ_S16_Legendary_Week_08",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTQ_S16_Legendary_Week_09",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTQ_S16_Legendary_Week_10",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTQ_S16_Legendary_Week_11",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.LTQ_S16_Legendary_Week_12",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.Event_NBA_Challenges",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": "EventFlag.Event_Spire_Challenges",
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        })
    }

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
