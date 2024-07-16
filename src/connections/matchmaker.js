const functions = require("../structs/functions.js");

module.exports = async (ws) => {
    const ticketId = functions.MakeID().replace(/-/ig, "");
    const matchId = functions.MakeID().replace(/-/ig, "");
    const sessionId = functions.MakeID().replace(/-/ig, "");

    await sendMessage("Connecting");
    await functions.sleep(800);

    await sendMessage("Waiting", { totalPlayers: 1, connectedPlayers: 1 });
    await functions.sleep(1000);

    await sendMessage("Queued", {
        ticketId,
        queuedPlayers: 0,
        estimatedWaitSec: 0,
        status: {},
    });
    await functions.sleep(4000);

    await sendMessage("SessionAssignment", { matchId });
    await functions.sleep(2000);

    await sendMessage("Play", { matchId, sessionId, joinDelaySec: 1 });

    function sendMessage(state, payload = {}) {
        ws.send(JSON.stringify({
            "payload": {
                ...payload,
                "state": state
            },
            "name": "StatusUpdate"
        }));
    }
};
