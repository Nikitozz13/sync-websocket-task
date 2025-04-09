import WebSocket from 'ws';

const FIRST_RESPONSE_TIMEOUT = 2000;
const STILL_HERE_TIMEOUT = 3000;
const LEAVE_NOW_TIMEOUT = 3500;

const retryMessageStart = (
	callback: () => void,
	maxAttempts: number = 4,
): void => {
	let attempts: number = 0;

	const retryMessage = (): void => {
		setTimeout(() => {
			attempts += 1;
			callback();

			if (attempts < maxAttempts) {
				retryMessage();
			}
		}, LEAVE_NOW_TIMEOUT);
	}

	retryMessage();
};

const sleep = async (delay: number): Promise<void> => {
	return new Promise((resolve) => {
	    setTimeout(() => {
	      resolve();
	    }, delay);
  	});
};

const wsServer = new WebSocket.Server({ port: 8080 });

wsServer.on('connection', async (wsClient: WebSocket) => {
	console.log('New connection');

	wsClient.on('message', (message: string) => {
		console.log('New message: %s', message);
	});

	wsClient.on('close', () => {
		console.log('Connection closed');
	});

	await sleep(FIRST_RESPONSE_TIMEOUT);
	wsClient.send('hello');
	
	await sleep(STILL_HERE_TIMEOUT);
	wsClient.send('still here?');

	retryMessageStart(() => {
		wsClient.send('you can leave now');
	}, 4);

});
