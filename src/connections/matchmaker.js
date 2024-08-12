const id = require("../structs/uuid.js");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


module.exports = async (ws) => {
    // create hashes
    const ticketId = id.MakeID().replace(/-/ig, "");
    const matchId = id.MakeID().replace(/-/ig, "");
    const sessionId = id.MakeID().replace(/-/ig, "");

    Connecting();
    await sleep(800);
    Waiting();
    await sleep(1000);
    Queued();
    await sleep(4000);
    SessionAssignment();
    await sleep(2000);
    Join();

    function Connecting() {
        ws.send(JSON.stringify({
            "payload": {
                "state": "Connecting"
            },
            "name": "StatusUpdate"
        }));
    }

    function Waiting() {
        ws.send(JSON.stringify({
            "payload": {
                "totalPlayers": 1,
                "connectedPlayers": 1,
                "state": "Waiting"
            },
            "name": "StatusUpdate"
        }));
    }

    function Queued() {
        ws.send(JSON.stringify({
            "payload": {
                "ticketId": ticketId,
                "queuedPlayers": 0,
                "estimatedWaitSec": 0,
                "status": {},
                "state": "Queued"
            },
            "name": "StatusUpdate"
        }));
    }

    function SessionAssignment() {
        ws.send(JSON.stringify({
            "payload": {
                "matchId": matchId,
                "state": "SessionAssignment"
            },
            "name": "StatusUpdate"
        }));
    }

    function Join() {
        ws.send(JSON.stringify({
            "payload": {
                "matchId": matchId,
                "sessionId": sessionId,
                "joinDelaySec": 1
            },
            "name": "Play"
        }));
    }
}
