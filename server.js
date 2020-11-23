const { Worker } = require('worker_threads')
const open = require('open');

/**
 * Worker to read trades data
 * @param {*} workerData 
 */
function runWorker1(workerData) {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./workers/worker1.js', { workerData });
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0)
                reject(new Error(`Stopped the Worker Thread with the exit code: ${code}`));
        })
    })
}

/**
 * Worker to compute OHLC trade data
 * @param {*} workerData 
 */
function runWorker2(workerData) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(
            './workers/worker2.js', { workerData });
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0)
                reject(new Error(`Stopped the Worker Thread with the exit code: ${code}`));
        })
    })
}

/**
 * Worker to initialize and serve OHLC data over websockets
 * @param {*} workerData 
 */
function runWorker3(workerData) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(
            './workers/worker3.js', { workerData });
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0)
                reject(new Error(`Stopped the Worker Thread with the exit code: ${code}`));
        })
    })
}

async function run() {
    const result1 = await runWorker1({ fileName: './data/trades.txt' })
    const result2 = await runWorker2({ tradesData: result1.tradesData })
    const result3 = await runWorker3({ ohlcData: result2.ohlcData })
    await open('./client/index.html', {wait: true});
}

run().catch(err => console.error(err)) 