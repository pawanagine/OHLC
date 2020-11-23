
const { workerData, parentPort } = require('worker_threads')
const fs = require('fs');
const readline = require('readline');
const moment = require("moment")

console.log('Worker1 Reading From File: ', workerData.fileName);

const readStream = fs.createReadStream(workerData.fileName)
const file = readline.createInterface({
    input: readStream,
    output: process.stdout,
    terminal: false
});

let tradesData = []
file.on('line', (line) => {
    let data = JSON.parse(line)
    data.date = moment.utc(data.TS).toDate()
    tradesData.push(data)
});

readStream.on('end', () => {
    parentPort.postMessage({ fileName: 'Worker1', status: 'Done', tradesData })
});
