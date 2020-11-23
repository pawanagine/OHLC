const { workerData, parentPort } = require('worker_threads')
const WebSocket = require('ws');

console.log('\nWorker3 Received OHLC Bar Data Count: ', workerData.ohlcData.length);

const ohlcData = JSON.stringify(workerData.ohlcData)

parentPort.postMessage({ fileName: workerData, status: 'Done' })

const server = new WebSocket.Server({
    port: 8081
}, () => {
    parentPort.postMessage({ fileName: workerData, status: 'Done' })
    console.log('Server listening..')
});

let sockets = [];
server.on('connection', function (socket) {
    sockets.push(socket);

    // When you receive a message, send that message to every socket.
    socket.on('message', function (msg) {
        console.log('Worker3 Received: ', msg);
        sockets.forEach(s => s.send(ohlcData));
    });

    socket.on('error', function () {
        console.log(error);
    });

    // When a socket closes, or disconnects, remove it from the array.
    socket.on('close', function () {
        sockets = sockets.filter(s => s !== socket);
    });
});
