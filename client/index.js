// Timing protocol implementation
class Protocol {

    timings = [];
    allowedDelay = 0;

    startTime = 0;
    currentTimingIndex = 0;

    constructor({
        timings,
        allowedDelay,
    }) {
        this.timings = timings;
        this.allowedDelay = allowedDelay;
    }

    async wait() {
        this.startTime = Date.now();
    }

    async check(message) {
        const currentTime = Date.now();

        const expectedTiming = this.timings[this.currentTimingIndex];

        const expectedTimeStart = this.startTime + expectedTiming - this.allowedDelay;
        const expectedTimeEnd = this.startTime + expectedTiming + this.allowedDelay;

        const actualTiming = Math.abs(currentTime - this.startTime);

        console.log({
            startTime: this.startTime,
            currentTime,
            expectedTiming,
            actualTiming,
            expectedTimeStart,
            expectedTimeEnd,
        })

        // To wait next message
        this.currentTimingIndex++;

        if ((currentTime < expectedTimeStart) || (currentTime > expectedTimeEnd)) {
            throw Error(
                `Protocol ERR: expected “${message}” between ${expectedTimeStart} and ${expectedTimeEnd} `
            )
        }

        return `Protocol OK: ${message} received at ${currentTime}`;
    }
}

// Log message on the page
function logMessageOnPage(message) {
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    const root = document.getElementById('list');
    root.appendChild(messageElement)
}

// Protocol initialization
const protocol = new Protocol({
    /* First 2303 timing used as a very close one
      to be able to randomly generate the timeout error **/
    timings: [2303, 3000, 3500, 3500, 3500, 3500],
    allowedDelay: 300,
});

// WebSocket logic
const wsClient = new WebSocket('ws://localhost:8080');

wsClient.onopen = function() {
    console.log('Connected');
    logMessageOnPage('Connection established..');
    logMessageOnPage('...');

    // start protocol
    protocol.wait();
};

wsClient.onmessage = async function(message) {
    console.log('Message: %s', message.data);
    logMessageOnPage(message.data);

    try {
        const result = await protocol.check(message.data);
        console.info(result);
    } catch (err) {
        console.error(err);

        // Gracefully close the connection
        wsClient.close();
    }

    // start new protocol iteration
    protocol.wait();
};

wsClient.onclose = function() {
    console.log('Connection closed');
    logMessageOnPage('Connection closed');
};
