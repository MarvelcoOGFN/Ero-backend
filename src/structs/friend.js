const Friends = require("../model/friends.js");
const Xmpp = require("../structs/XmppMessage.js");

async function getFriends(accountId) {
    return await Friends.findOne({ accountId: accountId }).lean();
}

async function validateFriendAdd(accountId, friendId) {
    let sender = await Friends.findOne({ accountId: accountId }).lean();
    let receiver = await Friends.findOne({ accountId: friendId }).lean();
    if (!sender || !receiver) return false;

    const isAlreadyAccepted = (list, id) => list.some(i => i.accountId === id);
    if (isAlreadyAccepted(sender.list.accepted, receiver.accountId) || isAlreadyAccepted(receiver.list.accepted, sender.accountId)) return false;

    const isBlocked = (list, id) => list.some(i => i.accountId === id);
    if (isBlocked(sender.list.blocked, receiver.accountId) || isBlocked(receiver.list.blocked, sender.accountId)) return false;

    if (sender.accountId === receiver.accountId) return false;

    return true;
}

async function validateFriendDelete(accountId, friendId) {
    let sender = await Friends.findOne({ accountId: accountId }).lean();
    let receiver = await Friends.findOne({ accountId: friendId }).lean();
    if (!sender || !receiver) return false;

    return true;
}

async function validateFriendBlock(accountId, friendId) {
    let sender = await Friends.findOne({ accountId: accountId }).lean();
    let receiver = await Friends.findOne({ accountId: friendId }).lean();

    if (!sender || !receiver) return false;

    const isBlocked = (list, id) => list.some(i => i.accountId === id);
    if (isBlocked(sender.list.blocked, receiver.accountId)) return false;
    if (sender.accountId === receiver.accountId) return false;

    return true;
}

async function sendFriendRequest(fromId, toId) {
    if (!await validateFriendAdd(fromId, toId)) return false;

    let from = await Friends.findOne({ accountId: fromId });
    let fromFriends = from.list;

    let to = await Friends.findOne({ accountId: toId });
    let toFriends = to.list;

    fromFriends.outgoing.push({ accountId: to.accountId, created: new Date().toISOString() });

    Xmpp.sendXmppMessageToId({
        "payload": {
            "accountId": to.accountId,
            "status": "PENDING",
            "direction": "OUTBOUND",
            "created": new Date().toISOString(),
            "favorite": false
        },
        "type": "com.epicgames.friends.core.apiobjects.Friend",
        "timestamp": new Date().toISOString()
    }, from.accountId);

    toFriends.incoming.push({ accountId: from.accountId, created: new Date().toISOString() });

    Xmpp.sendXmppMessageToId({
        "payload": {
            "accountId": from.accountId,
            "status": "PENDING",
            "direction": "INBOUND",
            "created": new Date().toISOString(),
            "favorite": false
        },
        "type": "com.epicgames.friends.core.apiobjects.Friend",
        "timestamp": new Date().toISOString()
    }, to.accountId);

    await from.updateOne({ $set: { list: fromFriends } });
    await to.updateOne({ $set: { list: toFriends } });

    return true;
}

async function acceptFriendRequest(fromId, toId) {
    if (!await validateFriendAdd(fromId, toId)) return false;

    let from = await Friends.findOne({ accountId: fromId });
    let fromFriends = from.list;

    let to = await Friends.findOne({ accountId: toId });
    let toFriends = to.list;

    let incomingIndex = fromFriends.incoming.findIndex(i => i.accountId == to.accountId);

    if (incomingIndex != -1) {
        fromFriends.incoming.splice(incomingIndex, 1);
        fromFriends.accepted.push({ accountId: to.accountId, created: new Date().toISOString() });

        Xmpp.sendXmppMessageToId({
            "payload": {
                "accountId": to.accountId,
                "status": "ACCEPTED",
                "direction": "OUTBOUND",
                "created": new Date().toISOString(),
                "favorite": false
            },
            "type": "com.epicgames.friends.core.apiobjects.Friend",
            "timestamp": new Date().toISOString()
        }, from.accountId);

        toFriends.outgoing.splice(toFriends.outgoing.findIndex(i => i.accountId == from.accountId), 1);
        toFriends.accepted.push({ accountId: from.accountId, created: new Date().toISOString() });

        Xmpp.sendXmppMessageToId({
            "payload": {
                "accountId": from.accountId,
                "status": "ACCEPTED",
                "direction": "OUTBOUND",
                "created": new Date().toISOString(),
                "favorite": false
            },
            "type": "com.epicgames.friends.core.apiobjects.Friend",
            "timestamp": new Date().toISOString()
        }, to.accountId);

        await from.updateOne({ $set: { list: fromFriends } });
        await to.updateOne({ $set: { list: toFriends } });
    }

    return true;
}

async function deleteFriend(fromId, toId) {
    if (!await validateFriendDelete(fromId, toId)) return false;

    let from = await Friends.findOne({ accountId: fromId });
    let fromFriends = from.list;

    let to = await Friends.findOne({ accountId: toId });
    let toFriends = to.list;

    let removed = false;

    for (let listType in fromFriends) {
        let findFriend = fromFriends[listType].findIndex(i => i.accountId == to.accountId);
        let findToFriend = toFriends[listType].findIndex(i => i.accountId == from.accountId);

        if (findFriend != -1) {
            fromFriends[listType].splice(findFriend, 1);
            removed = true;
        }

        if (listType == "blocked") continue;

        if (findToFriend != -1) toFriends[listType].splice(findToFriend, 1);
    }

    if (removed == true) {
        Xmpp.sendXmppMessageToId({
            "payload": {
                "accountId": to.accountId,
                "reason": "DELETED"
            },
            "type": "com.epicgames.friends.core.apiobjects.FriendRemoval",
            "timestamp": new Date().toISOString()
        }, from.accountId);

        Xmpp.sendXmppMessageToId({
            "payload": {
                "accountId": from.accountId,
                "reason": "DELETED"
            },
            "type": "com.epicgames.friends.core.apiobjects.FriendRemoval",
            "timestamp": new Date().toISOString()
        }, to.accountId);

        await from.updateOne({ $set: { list: fromFriends } });
        await to.updateOne({ $set: { list: toFriends } });
    }

    return true;
}

async function blockFriend(fromId, toId) {
    if (!await validateFriendDelete(fromId, toId)) return false;
    if (!await validateFriendBlock(fromId, toId)) return false;
    await deleteFriend(fromId, toId);

    let from = await Friends.findOne({ accountId: fromId });
    let fromFriends = from.list;

    let to = await Friends.findOne({ accountId: toId });
    
    fromFriends.blocked.push({ accountId: to.accountId, created: new Date().toISOString() });

    await from.updateOne({ $set: { list: fromFriends } });

    return true;
}

module.exports = {
    validateFriendAdd,
    validateFriendDelete,
    sendFriendRequest,
    acceptFriendRequest,
    blockFriend,
    deleteFriend
};
