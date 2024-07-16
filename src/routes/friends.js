const express = require("express");
const app = express.Router();
const functions = require("../structs/functions.js");
const Friends = require("../model/friends.js");
const friendManager = require("../structs/friend.js");
const { verifyToken, verifyClient } = require("../token/tokenVerify.js");

const validationFail = (res) => {
    return res.status(400).json({
        "error": "Validation Failed. Invalid fields were [alias]"
    });
};

app.get("/friends/api/v1/*/settings", (req, res) => {
    res.json({});
});

app.get("/friends/api/v1/*/blocklist", (req, res) => {
    res.json([]);
});

app.get("/friends/api/public/list/fortnite/*/recentPlayers", (req, res) => {
    res.json([]);
});

app.get("/friends/api/public/friends/:accountId", verifyToken, async (req, res) => {
    try {
        const friends = await Friends.findOne({ accountId: req.user.accountId }).lean();
        let response = [];

        const processFriendList = (friendList, status, direction) => {
            friendList.forEach((friend) => {
                response.push({
                    "accountId": friend.accountId,
                    "status": status,
                    "direction": direction,
                    "created": friend.created,
                    "favorite": false
                });
            });
        };

        processFriendList(friends.list.accepted, "ACCEPTED", "OUTBOUND");
        processFriendList(friends.list.incoming, "PENDING", "INBOUND");
        processFriendList(friends.list.outgoing, "PENDING", "OUTBOUND");

        res.json(response);
    } catch (error) {
        res.status(500).json({ "error": "Internal Server Error" });
    }
});

app.post("/friends/api/*/friends*/:receiverId", verifyToken, async (req, res) => {
    try {
        const sender = await Friends.findOne({ accountId: req.user.accountId });
        const receiver = await Friends.findOne({ accountId: req.params.receiverId });

        if (!sender || !receiver) {
            return res.status(403).end();
        }

        if (sender.list.incoming.find(i => i.accountId == receiver.accountId)) {
            if (!await friendManager.acceptFriendReq(sender.accountId, receiver.accountId)) {
                return res.status(403).end();
            }

            functions.getPresenceFromUser(sender.accountId, receiver.accountId, false);
            functions.getPresenceFromUser(receiver.accountId, sender.accountId, false);
        } else if (!sender.list.outgoing.find(i => i.accountId == receiver.accountId)) {
            if (!await friendManager.sendFriendReq(sender.accountId, receiver.accountId)) {
                return res.status(403).end();
            }
        }

        res.status(204).end();
    } catch (error) {
        res.status(500).json({ "error": "Internal Server Error" });
    }
});

app.delete("/friends/api/*/friends*/:receiverId", verifyToken, async (req, res) => {
    try {
        const sender = await Friends.findOne({ accountId: req.user.accountId });
        const receiver = await Friends.findOne({ accountId: req.params.receiverId });
        if (!sender || !receiver) {
            return res.status(403).end();
        }

        if (!await friendManager.deleteFriend(sender.accountId, receiver.accountId)) {
            return res.status(403).end();
        }

        functions.getPresenceFromUser(sender.accountId, receiver.accountId, true);
        functions.getPresenceFromUser(receiver.accountId, sender.accountId, true);

        res.status(204).end();
    } catch (error) {
        res.status(500).json({ "error": "Internal Server Error" });
    }
});

app.post("/friends/api/*/blocklist*/:receiverId", verifyToken, async (req, res) => {
    try {
        const sender = await Friends.findOne({ accountId: req.user.accountId });
        const receiver = await Friends.findOne({ accountId: req.params.receiverId });
        if (!sender || !receiver) {
            return res.status(403).end();
        }

        if (!await friendManager.blockFriend(sender.accountId, receiver.accountId)) {
            return res.status(403).end();
        }

        functions.getPresenceFromUser(sender.accountId, receiver.accountId, true);
        functions.getPresenceFromUser(receiver.accountId, sender.accountId, true);

        res.status(204).end();
    } catch (error) {
        res.status(500).json({ "error": "Internal Server Error" });
    }
});

app.delete("/friends/api/*/blocklist*/:receiverId", verifyToken, async (req, res) => {
    try {
        const sender = await Friends.findOne({ accountId: req.user.accountId });
        const receiver = await Friends.findOne({ accountId: req.params.receiverId });
        if (!sender || !receiver) {
            return res.status(403).end();
        }

        if (!await friendManager.deleteFriend(sender.accountId, receiver.accountId)) {
            return res.status(403).end();
        }

        res.status(204).end();
    } catch (error) {
        res.status(500).json({ "error": "Internal Server Error" });
    }
});

app.get("/friends/api/v1/:accountId/summary", verifyToken, async (req, res) => {
    try {
        let response = {
            "friends": [],
            "incoming": [],
            "outgoing": [],
            "suggested": [],
            "blocklist": [],
            "settings": {
                "acceptInvites": "public"
            }
        };

        const friends = await Friends.findOne({ accountId: req.user.accountId }).lean();

        const processFriendList = (friendList, key, additionalProperties) => {
            friendList.forEach((friend) => {
                let item = { "accountId": friend.accountId, ...additionalProperties };
                response[key].push(item);
            });
        };

        processFriendList(friends.list.accepted, "friends", {
            "groups": [],
            "mutual": 0,
            "alias": "",
            "note": "",
            "favorite": false,
            "created": friend.created
        });

        processFriendList(friends.list.incoming, "incoming", {
            "mutual": 0,
            "favorite": false,
            "created": friend.created
        });

        processFriendList(friends.list.outgoing, "outgoing", {
            "favorite": false
        });

        processFriendList(friends.list.blocked, "blocklist", {});

        res.json(response);
    } catch (error) {
        res.status(500).json({ "error": "Internal Server Error" });
    }
});

app.get("/friends/api/public/blocklist/*", verifyToken, async (req, res) => {
    try {
        let friends = await Friends.findOne({ accountId: req.user.accountId }).lean();

        res.json({
            "blockedUsers": friends.list.blocked.map(i => i.accountId)
        });
    } catch (error) {
        res.status(500).json({ "error": "Internal Server Error" });
    }
});

app.all("/friends/api/v1/*/friends/:friendId/alias", verifyToken, getRawBody, async (req, res) => {
    try {
        let friends = await Friends.findOne({ accountId: req.user.accountId }).lean();

        const allowedCharacters = (" !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~").split("");

        for (let character of req.rawBody) {
            if (!allowedCharacters.includes(character)) {
                return validationFail(res);
            }
        }

        if (!friends.list.accepted.find(i => i.accountId == req.params.friendId)) {
            return res.status(404).json({
                "error": `Friendship between ${req.user.accountId} and ${req.params.friendId} does not exist`
            });
        }

        const friendIndex = friends.list.accepted.findIndex(i => i.accountId == req.params.friendId);

        switch (req.method) {
            case "PUT":
                if (req.rawBody.length < 3 || req.rawBody.length > 16) {
                    return validationFail(res);
                }

                friends.list.accepted[friendIndex].alias = req.rawBody;

                await friends.updateOne({ $set: { list: friends.list } });
                break;

            case "DELETE":
                friends.list.accepted[friendIndex].alias = "";

                await friends.updateOne({ $set: { list: friends.list } });
                break;
        }

        res.status(204).end();
    } catch (error) {
        res.status(500).json({ "error": "Internal Server Error" });
    }
});

function getRawBody(req, res, next) {
    if (req.headers["content-length"]) {
        if (Number(req.headers["content-length"]) > 16) {
            return res.status(403).json({ "error": "File size must be 16 bytes or less." });
        }
    }

    try {
        req.rawBody = "";
        req.on("data", (chunk) => req.rawBody += chunk);
        req.on("end", () => next());
    } catch {
        res.status(400).json({ "error": "Something went wrong while trying to access the request body." });
    }
}

module.exports = app;
