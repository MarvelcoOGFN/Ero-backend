const WebSocket = require("ws").Server;
const XMLBuilder = require("xmlbuilder");
const XMLParser = require("xml-parser");
const express = require("express");
const app = express();

const functions = require("../structs/functions.js");
const User = require("../model/user.js");
const Friends = require("../model/friends.js");

const port = 80;
const server = app.listen(port);
const wss = new WebSocket({ server });
const matchmaker = require("../connections/matchmaker.js");

global.xmppDomain = "prod.ol.epicgames.com";
global.Clients = [];
global.MUCs = {};

app.get("/", (req, res) => {
    res.type("application/json");
    const data = {
        Clients: {
            amount: global.Clients.length,
            clients: global.Clients.map(i => i.displayName)
        }
    };
    res.send(JSON.stringify(data, null, 2));
});

app.get("/clients", (req, res) => {
    res.type("application/json");
    const data = {
        amount: global.Clients.length,
        clients: global.Clients.map(i => i.displayName)
    };
    res.send(JSON.stringify(data, null, 2));
});

wss.on('listening', () => console.log('\x1b[33m%s\x1b[0m',"XMPP and Matchmaker started on port", port));

wss.on('connection', ws => {
    ws.on('error', () => {});
    if (ws.protocol.toLowerCase() !== "xmpp") return matchmaker(ws);

    let joinedMUCs = [];
    let accountId = "";
    let displayName = "";
    let token = "";
    let jid = "";
    let resource = "";
    let ID = "";
    let Authenticated = false;
    let clientExists = false;
    let connectionClosed = false;

    ws.on('message', handleMessage);
    ws.on('close', () => { connectionClosed = true; clientExists = false; RemoveClient(ws, joinedMUCs); });

    function handleMessage(message) {
        if (Buffer.isBuffer(message)) message = message.toString();
        const msg = XMLParser(message);
        if (!msg || !msg.root || !msg.root.name) return Error(ws);

        const messageHandlers = {
            open: handleOpenMessage,
            auth: handleAuthMessage,
            iq: handleIQMessage,
            message: handleMessageMessage,
            presence: handlePresenceMessage
        };

        if (messageHandlers[msg.root.name]) {
            messageHandlers[msg.root.name]();
        }

        if (!clientExists && !connectionClosed) {
            handleClientCreation();
        }
    }

    function handleOpenMessage() {
    }

    function handleAuthMessage() {
    }

    function handleIQMessage() {
    }

    function handleMessageMessage() {
    }

    function handlePresenceMessage() {
    }

    function handleClientCreation() {
    }
});

function Error(ws) {
    ws.send(XMLBuilder.create("close").attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-framing").toString());
    ws.close();
}

function RemoveClient(ws, joinedMUCs) {
}

async function getPresenceFromFriends(ws, accountId, jid) {
}

async function updatePresenceForFriends(ws, body, away, offline) {
}

function sendXmppMessageToClient(senderJid, msg, body) {
}

function getMUCmember(roomName, displayName, accountId, resource) {
}
