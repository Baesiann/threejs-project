// This module is to handle connection/sending/receiving
import Ably from 'ably';

class OnlineProvider {
    constructor(apiKey, roomID) {
        // Generate random ID for client session
        this.clientId = 'player-' + Math.random().toString(36).substring(2, 9);

        // Pass clientId into ably config
        this.ably = new Ably.Realtime({
            key: apiKey,
            clientId: this.clientId
        });

        this.channel = this.ably.channels.get(`chess-room-${roomID}`);
        this.roomID = roomID;
        this.myColor = null;
    }

    async connect() {
        // Enter the precense set with clientID
        await this.channel.presence.enter();

        // Check Room
        const members = await this.channel.presence.get();

        // Assign color
        if (members.length === 1) {
            this.myColor = 'white';
        } else {
            this.myColor = 'black';
            // start game now
            if (this.onReadyCallback) {
                this.onReadyCallback(this.myColor);
            }
        }

        // Set up subscription to wait
        this.channel.presence.subscribe('enter', async () => {
            const currentMembers = await this.channel.presence.get();
            if (currentMembers.length === 2 && this.onReadyCallback) {
                this.onReadyCallback(this.myColor);
            }
        });
    }

    // Send move to Ably channel
    sendMove(move) {
        // console.log("Publishing move to Ably: ", move);
        this.channel.publish('move', move);
    }

    onReady(callback) {
        this.onReadyCallback = callback;
    }

    onMoveReceived(callback) {
        this.channel.subscribe('move', (message) => {
            // Don't process move if sent by this client
            if (message.clientId !== this.clientId) {
                // console.log("Received move from opponent: ", message.data);
                callback(message.data);
            }
        });
    }
}

export { OnlineProvider };