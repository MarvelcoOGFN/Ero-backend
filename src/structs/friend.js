const Friends = require("../model/friends.js");
const Xmpp = require("../structs/XmppMessage.js");

async function getFriends(accountId) {
    return await Friends.findOne({ accountId: accountId });
}

async function validateFriendAdd(accountId, friendId) {
    const sender = await getFriends(accountId);
    const receiver = await getFriends(friendId);

    if (!sender || !receiver) return false;

    const isAlreadyAccepted = (list, id) => list.some(i => i.accountId === id);
    if (isAlreadyAccepted(sender.list.accepted, receiver.accountId) || isAlreadyAccepted(receiver.list.accepted, sender.accountId)) return false;

    const isBlocked = (list, id) => list.some(i => i.accountId === id);
    if (isBlocked(sender.list.blocked, receiver.accountId) || isBlocked(receiver.list.blocked, sender.accountId)) return false;

    if (sender.accountId === receiver.accountId) return false;

    return true;
}

async function validateFriendDelete(accountId, friendId) {
    const sender = await getFriends(accountId);
    const receiver = await getFriends(friendId);

    if (!sender || !receiver) return false;

    return true;
}

async function validateFriendBlock(accountId, friendId) {
    const sender = await getFriends(accountId);
    const receiver = await getFriends(friendId);

    if (!sender || !receiver) return false;

    const isBlocked = (list, id) => list.some(i => i.accountId === id);
    if (isBlocked(sender.list.blocked, receiver.accountId)) return false;
    if (sender.accountId === receiver.accountId) return false;

    return true;
}
async function sendFriendReq(fromId, toId) {
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

async function sendFriendRequest(fromId, toId) {
    if (!await validateFriendAdd(fromId, toId)) return false;

    const from = await getFriends(fromId);
    const to = await getFriends(toId);
    const currentTime = new Date().toISOString();

    from.list.outgoing.push({ accountId: to.accountId, created: currentTime });
    to.list.incoming.push({ accountId: from.accountId, created: currentTime });

    Xmpp.sendXmppMessageToId(createFriendPayload(to.accountId, "PENDING", "OUTBOUND", currentTime), from.accountId);
    Xmpp.sendXmppMessageToId(createFriendPayload(from.accountId, "PENDING", "INBOUND", currentTime), to.accountId);

    await updateFriendsLists(from, to);

    return true;
}

async function acceptFriendRequest(fromId, toId) {
    if (!await validateFriendAdd(fromId, toId)) return false;

    const from = await getFriends(fromId);
    const to = await getFriends(toId);

    const incomingIndex = from.list.incoming.findIndex(i => i.accountId === to.accountId);

    if (incomingIndex !== -1) {
        const currentTime = new Date().toISOString();

        from.list.incoming.splice(incomingIndex, 1);
        from.list.accepted.push({ accountId: to.accountId, created: currentTime });

        Xmpp.sendXmppMessageToId(createFriendPayload(to.accountId, "ACCEPTED", "OUTBOUND", currentTime), from.accountId);

        const outgoingIndex = to.list.outgoing.findIndex(i => i.accountId === from.accountId);

        if (outgoingIndex !== -1) {
            to.list.outgoing.splice(outgoingIndex, 1);
            to.list.accepted.push({ accountId: from.accountId, created: currentTime });

            Xmpp.sendXmppMessageToId(createFriendPayload(from.accountId, "ACCEPTED", "OUTBOUND", currentTime), to.accountId);

            await updateFriendsLists(from, to);
        }
    }

    return true;
}

async function deleteFriend(fromId, toId) {
    if (!await validateFriendDelete(fromId, toId)) return false;

    const from = await getFriends(fromId);
    const to = await getFriends(toId);

    let removed = false;
    const currentTime = new Date().toISOString();

    for (const listType in from.list) {
        const findFriendIndex = from.list[listType].findIndex(i => i.accountId === to.accountId);
        const findToFriendIndex = to.list[listType].findIndex(i => i.accountId === from.accountId);

        if (findFriendIndex !== -1) {
            from.list[listType].splice(findFriendIndex, 1);
            removed = true;
        }

        if (listType === "blocked") continue;

        if (findToFriendIndex !== -1) to.list[listType].splice(findToFriendIndex, 1);
    }

    if (removed) {
        Xmpp.sendXmppMessageToId(createFriendRemovalPayload(to.accountId, "DELETED"), from.accountId);
        Xmpp.sendXmppMessageToId(createFriendRemovalPayload(from.accountId, "DELETED"), to.accountId);

        await updateFriendsLists(from, to);
    }

    return true;
}

async function blockFriend(fromId, toId) {
    if (!await validateFriendDelete(fromId, toId) || !await validateFriendBlock(fromId, toId)) return false;

    await deleteFriend(fromId, toId);

    const from = await getFriends(fromId);
    const currentTime = new Date().toISOString();

    from.list.blocked.push({ accountId: toId, created: currentTime });

    await updateFriendsLists(from);

    return true;
}

function createFriendPayload(accountId, status, direction, created) {
    return {
        "payload": {
            "accountId": accountId,
            "status": status,
            "direction": direction,
            "created": created,
            "favorite": false
        },
        "type": "com.epicgames.friends.core.apiobjects.Friend",
        "timestamp": created
    };
}

function createFriendRemovalPayload(accountId, reason) {
    return {
        "payload": {
            "accountId": accountId,
            "reason": reason
        },
        "type": "com.epicgames.friends.core.apiobjects.FriendRemoval",
        "timestamp": new Date().toISOString()
    };
}

async function updateFriendsLists(...friends) {
    for (const friend of friends) {
        friend.markModified('list'); // Explicitly mark the 'list' field as modified
        await friend.save(); // Save the changes to the database
    }
}

module.exports = {
    validateFriendAdd,
    validateFriendDelete,
    sendFriendReq,
    sendFriendRequest,
    acceptFriendRequest,
    blockFriend,
    deleteFriend
};
