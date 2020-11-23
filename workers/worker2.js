
const { workerData, parentPort } = require('worker_threads')
const moment = require("moment")

console.log('\nWorker2 Received Trade Records Count: ', workerData.tradesData.length);

function calculateOHLCData(workerData) {
    var parsedData = workerData.tradesData,
        pointStart = parsedData[0].date,
        range = [],
        low,
        high,
        ranges = [],
        dataOHLC = [],
        interval = 15 * 1000;

    try {
        parsedData.sort(function (a, b) {
            return a.date - b.date
        });

        parsedData.forEach(function (el, i) {
            if (pointStart + interval < el.date) {
                ranges.push(range.slice());
                range = [];
                range.push(el);
                pointStart = pointStart + interval;
            } else {
                range.push(el);
            }

            if (i === parsedData.length - 1) {
                ranges.push(range);
            }
        });

        let bar_num = 1
        ranges.forEach(function (range, i) {
            low = range[0].P;
            high = range[0].P;

            range.forEach(function (el) {
                low = Math.min(low, el.P);
                high = Math.max(high, el.P);
            });

            dataOHLC.push({
                bar_num,
                x: range[0].date + 30 * 1000,
                open: Number(range[0].P),
                high: high,
                low: low,
                close: Number(range[range.length - 1].P)
            });
            bar_num += 1
        });
    } catch (error) {
        console.log(error);
    }
    return dataOHLC
}

const ohlcData = calculateOHLCData(workerData) || []

parentPort.postMessage({ fileName: 'Worker2', status: 'Done', ohlcData })
