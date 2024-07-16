const WebSocket = require("ws").Server;
const XMLBuilder = require("xmlbuilder");
const XMLParser = require("xml-parser");
const express = require("express");
const functions = require("../structs/functions.js");
const User = require("../model/user.js");
const Friends = require("../model/friends.js");
const matchmaker = require("./matchmaker.js");

const app = express();
const port = 80;
const wss = new WebSocket({ server: app.listen(port) });

global.xmppDomain = "prod.ol.epicgames.com";
global.Clients = [];
global.MUCs = {};

app.get("/", (req, res) => {
    res.type("application/json");
    res.send(JSON.stringify({
        "Clients": {
            "amount": global.Clients.length,
            "clients": global.Clients.map(client => client.displayName)
        }
    }, null, 2));
});

app.get("/clients", (req, res) => {
    res.type("application/json");
    res.send(JSON.stringify({
        "amount": global.Clients.length,
        "clients": global.Clients.map(client => client.displayName)
    }, null, 2));
});

wss.on('listening', () => console.log('\x1b[33m%s\x1b[0m',"XMPP and Matchmaker started on port", port));

wss.on('connection', async (ws) => {
    ws.on('error', () => {});

    if (ws.protocol.toLowerCase() !== "xmpp") return matchmaker(ws);

    let clientData = {
        joinedMUCs: [],
        accountId: "",
        displayName: "",
        token: "",
        jid: "",
        resource: "",
        ID: "",
        Authenticated: false,
        clientExists: false,
        connectionClosed: false
    };

    ws.on('message', async (message) => {
        if (Buffer.isBuffer(message)) message = message.toString();
        const msg = XMLParser(message);
        if (!msg || !msg.root || !msg.root.name) return handleError(ws);

        switch (msg.root.name) {
            case "open":
                handleOpen(ws, clientData);
                break;
            case "auth":
                await handleAuth(ws, msg, clientData);
                break;
            case "iq":
                await handleIQ(ws, msg, clientData);
                break;
            case "message":
                handleMessage(ws, msg, clientData);
                break;
            case "presence":
                handlePresence(ws, msg, clientData);
                break;
        }

        if (!clientData.clientExists && !clientData.connectionClosed) {
            if (isAuthenticated(clientData)) {
                global.Clients.push({
                    client: ws,
                    accountId: clientData.accountId,
                    displayName: clientData.displayName,
                    token: clientData.token,
                    jid: clientData.jid,
                    resource: clientData.resource,
                    lastPresenceUpdate: {
                        away: false,
                        status: "{}"
                    }
                });
                clientData.clientExists = true;
            }
        }
    });

    ws.on('close', () => {
        clientData.connectionClosed = true;
        clientData.clientExists = false;
        removeClient(ws, clientData.joinedMUCs);
    });
});

function handleOpen(ws, clientData) {
    if (!clientData.ID) clientData.ID = functions.MakeID();
    ws.send(XMLBuilder.create("open")
        .attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-framing")
        .attribute("from", global.xmppDomain)
        .attribute("id", clientData.ID)
        .attribute("version", "1.0")
        .attribute("xml:lang", "en").toString());

    ws.send(XMLBuilder.create("stream:features")
        .attribute("xmlns:stream", "http://etherx.jabber.org/streams")
        .element("mechanisms").attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-sasl")
        .element("mechanism", "PLAIN").up().up()
        .element("ver").attribute("xmlns", "urn:xmpp:features:rosterver").up()
        .element("starttls").attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-tls").up()
        .element("compression").attribute("xmlns", "http://jabber.org/features/compress")
        .element("method", "zlib").up().up()
        .element("auth").attribute("xmlns", "http://jabber.org/features/iq-auth").up().toString());
}

async function handleAuth(ws, msg, clientData) {
    if (!clientData.ID || clientData.accountId) return handleError(ws);
    if (!msg.root.content) return handleError(ws);
    if (!functions.DecodeBase64(msg.root.content).includes("\u0000")) return handleError(ws);

    const decodedBase64 = functions.DecodeBase64(msg.root.content).split("\u0000");
    const object = global.accessTokens.find(token => token.token === decodedBase64[2]);
    if (!object) return handleError(ws);

    if (global.Clients.find(client => client.accountId === object.accountId)) return handleError(ws);

    const user = await User.findOne({ accountId: object.accountId, banned: false }).lean();
    if (!user) return handleError(ws);

    Object.assign(clientData, {
        accountId: user.accountId,
        displayName: user.username,
        token: object.token,
        Authenticated: true
    });
    ws.send(XMLBuilder.create("success").attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-sasl").toString());
}

async function handleIQ(ws, msg, clientData) {
    if (!clientData.ID) return;

    switch (msg.root.attributes.id) {
        case "_xmpp_bind1":
            await handleBind(ws, msg, clientData);
            break;
        case "_xmpp_session1":
            await handleSession(ws, msg, clientData);
            break;
        default:
            if (!clientData.clientExists) return handleError(ws);
            ws.send(XMLBuilder.create("iq")
                .attribute("to", clientData.jid)
                .attribute("from", global.xmppDomain)
                .attribute("id", msg.root.attributes.id)
                .attribute("xmlns", "jabber:client")
                .attribute("type", "result").toString());
    }
}

async function handleBind(ws, msg, clientData) {
    if (clientData.resource || !clientData.accountId) return handleError(ws);

    const bindElement = msg.root.children.find(child => child.name === "bind");
    const resourceElement = bindElement && bindElement.children.find(child => child.name === "resource");
    if (!resourceElement || !resourceElement.content) return handleError(ws);

    clientData.resource = resourceElement.content;
    clientData.jid = `${clientData.accountId}@${global.xmppDomain}/${clientData.resource}`;

    ws.send(XMLBuilder.create("iq")
        .attribute("to", clientData.jid)
        .attribute("id", "_xmpp_bind1")
        .attribute("xmlns", "jabber:client")
        .attribute("type", "result")
        .element("bind")
        .attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-bind")
        .element("jid", clientData.jid).up().up().toString());
}

async function handleSession(ws, msg, clientData) {
    if (!clientData.clientExists) return handleError(ws);

    ws.send(XMLBuilder.create("iq")
        .attribute("to", clientData.jid)
        .attribute("from", global.xmppDomain)
        .attribute("id", "_xmpp_session1")
        .attribute("xmlns", "jabber:client")
        .attribute("type", "result").toString());

    await getPresenceFromFriends(ws, clientData.accountId, clientData.jid);
}

function handleMessage(ws, msg, clientData) {
    if (!clientData.clientExists) return handleError(ws);

    const bodyElement = msg.root.children.find(child => child.name === "body");
    if (!bodyElement || !bodyElement.content) return handleError(ws);

    const body = bodyElement.content;
    const messageType = msg.root.attributes.type;

    if (body.length >= 300) return;

    if (messageType === "chat") {
        handleChatMessage(ws, msg, clientData, body);
    } else if (messageType === "groupchat") {
        handleGroupChatMessage(ws, msg, clientData, body);
    } else if (isJSON(body)) {
        handleJSONMessage(ws, msg, clientData, body);
    }
}

function handleChatMessage(ws, msg, clientData, body) {
    if (!msg.root.attributes.to) return;

    const receiver = global.Clients.find(client => client.jid.split("/")[0] === msg.root.attributes.to);
    if (!receiver || receiver.accountId === clientData.accountId) return;

    receiver.client.send(XMLBuilder.create("message")
        .attribute("to", receiver.jid)
        .attribute("from", clientData.jid)
        .attribute("xmlns", "jabber:client")
        .attribute("type", "chat")
        .element("body", body).up().toString());
}

function handleGroupChatMessage(ws, msg, clientData, body) {
    const mucRoom = msg.root.attributes.to.split("@")[0];
    const senderMuc = getMUCmember(mucRoom, clientData.displayName);

    if (global.MUCs[mucRoom]) {
        Object.values(global.MUCs[mucRoom]).forEach(receiver => {
            if (receiver.accountId === clientData.accountId) return;

            receiver.client.send(XMLBuilder.create("message")
                .attribute("to", receiver.jid)
                .attribute("from", `${mucRoom}@muc.prod.ol.epicgames.com/${clientData.displayName}`)
                .attribute("xmlns", "jabber:client")
                .attribute("type", "groupchat")
                .element("body", body).up().toString());
        });
    } else {
          //nothing!!!
    }
}

function handleJSONMessage(ws, msg, clientData, body) {
    const json = JSON.parse(body);
    switch (json.type) {
        case "com.epicgames.xmpp.muc.add_member":
            handleMUCAddMember(ws, msg, clientData, json);
            break;
        case "com.epicgames.social.party.notification.v0.PING":
            handlePartyPing(ws, msg, clientData, json);
            break;
    }
}

function handleMUCAddMember(ws, msg, clientData, json) {
    const mucRoom = msg.root.attributes.to.split("@")[0];
    if (!global.MUCs[mucRoom]) global.MUCs[mucRoom] = {};

    json.members.forEach(member => {
        const receiver = global.Clients.find(client => client.accountId === member.accountId);
        if (receiver && !global.MUCs[mucRoom][receiver.accountId]) {
            global.MUCs[mucRoom][receiver.accountId] = receiver;
            receiver.client.send(XMLBuilder.create("message")
                .attribute("to", receiver.jid)
                .attribute("from", clientData.jid)
                .attribute("xmlns", "jabber:client")
                .attribute("type", "groupchat")
                .element("body", body).up().toString());
        }
    });

    clientData.joinedMUCs.push(mucRoom);
}

function handlePartyPing(ws, msg, clientData, json) {
    const friends = Friends.find({ accountId: clientData.accountId }).lean();
    friends.forEach(friend => {
        const receiver = global.Clients.find(client => client.accountId === friend.accountId);
        if (receiver) {
            receiver.client.send(XMLBuilder.create("message")
                .attribute("to", receiver.jid)
                .attribute("from", clientData.jid)
                .attribute("xmlns", "jabber:client")
                .attribute("type", "chat")
                .element("body", JSON.stringify(json)).up().toString());
        }
    });
}

function handlePresence(ws, msg, clientData) {
    if (!clientData.clientExists) return handleError(ws);

    const showElement = msg.root.children.find(child => child.name === "show");
    const statusElement = msg.root.children.find(child => child.name === "status");

    const away = showElement ? (showElement.content === "xa" || showElement.content === "away") : false;
    const status = statusElement ? statusElement.content : "{}";

    const client = global.Clients.find(client => client.accountId === clientData.accountId);
    if (client) {
        Object.assign(client.lastPresenceUpdate, { away, status });
    }

    updatePresenceForFriends(clientData.accountId, away, status);
}

function handleError(ws) {
    ws.send(XMLBuilder.create("failure").attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-sasl").toString());
    ws.close();
}

function removeClient(ws, joinedMUCs) {
    global.Clients = global.Clients.filter(client => client.client !== ws);
    joinedMUCs.forEach(muc => {
        delete global.MUCs[muc][ws.accountId];
    });
    updatePresenceForFriends(ws.accountId, true, "{}");
}

async function getPresenceFromFriends(ws, accountId, jid) {
    const friends = await Friends.find({ accountId }).lean();
    friends.forEach(async (friend) => {
        const friendData = await User.findOne({ accountId: friend.accountId, banned: false }).lean();
        if (friendData) {
            const friendClient = global.Clients.find(client => client.accountId === friend.accountId);
            if (friendClient) {
                ws.send(XMLBuilder.create("presence")
                    .attribute("to", jid)
                    .attribute("from", `${friend.accountId}@${global.xmppDomain}/Fortnite`)
                    .attribute("xmlns", "jabber:client")
                    .element("show", friendClient.lastPresenceUpdate.away ? "away" : "chat").up()
                    .element("status", friendClient.lastPresenceUpdate.status).up().toString());
            }
        }
    });
}

function updatePresenceForFriends(accountId, away, status) {
    Friends.find({ accountId }).lean().then(friends => {
        friends.forEach(friend => {
            const friendClient = global.Clients.find(client => client.accountId === friend.accountId);
            if (friendClient) {
                friendClient.client.send(XMLBuilder.create("presence")
                    .attribute("to", friendClient.jid)
                    .attribute("from", `${accountId}@${global.xmppDomain}/Fortnite`)
                    .attribute("xmlns", "jabber:client")
                    .element("show", away ? "away" : "chat").up()
                    .element("status", status).up().toString());
            }
        });
    });
}

function isAuthenticated(clientData) {
    return clientData.ID && clientData.accountId && clientData.displayName && clientData.token && clientData.Authenticated;
}

function getMUCmember(muc, displayName) {
    return global.MUCs[muc] ? global.MUCs[muc][displayName] : null;
}

function isJSON(value) {
    try {
        JSON.parse(value);
        return true;
    } catch {
        return false;
    }
}

module.exports = { wss, app };
