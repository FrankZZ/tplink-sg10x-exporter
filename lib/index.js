'use strict';

// const config = require('../config');
const log = require('./log');
const cron = require('node-cron');
const api = require('./api');
const config = require('../config');
const Reporter = require(`./reporter/${config.get('reporter.reporter')}`);
const lastPackets = [];
const currentSpeeds = [];
const MTU_SIZE_IN_BITS = 1500 * 8;
const reporter = new Reporter(config);

(async () => {
    log.info('Preparing reporter...');

    [
        'TxGoodPkt',
        'TxBadPkt',
        'RxGoodPkt',
        'RxBadPkt'
    ].forEach((metricKey) => {
        for(let i = 1; i <= 8; i++) {
            const metricName = `Port${i}${metricKey}`;

            log.debug({
                metricName
            }, 'Adding gauge to reporter');

            reporter.addGauge(metricName);
        }
    });
    log.info('Preparing reporter done');

    log.info('Logging in...');
    await api.login();
    log.info('Logging in done');

    log.info('Sending Gauge values to reporter...');
    cron.schedule('*/5 * * * * *', async () => {
        log.info('Requesting portStatistics...');
        const portStats = await api.getPortStatistics();
        log.info('Requesting portStatistics done');

        let j;
        for (let i = 0; i < portStats.length; i++) {
            j = i + 1;
            lastPackets[i] = lastPackets[i] || {};

            Object.keys(portStats[i]).forEach((metricKey) => {
                lastPackets[i][metricKey] = lastPackets[i][metricKey] || {};
                const metricValue = portStats[i][metricKey];
                reporter.setGauge(`Port${j}${metricKey}`, metricValue);
                const currentTime = new Date().getTime();
                const packetsSinceLastTime = (metricValue - (lastPackets[i][metricKey].value || 0));
                const timeDifference = currentTime - (lastPackets[i][metricKey].time || currentTime);
                const packetsPerSecond = (packetsSinceLastTime / timeDifference) * 1000;
                const bitsPerSecond = packetsPerSecond * MTU_SIZE_IN_BITS;
                const mbps = bitsPerSecond / 1000 / 1000;

                log.debug({
                    metricKey,
                    metricValue,
                    currentTime,
                    packetsSinceLastTime,
                    timeDifference,
                    packetsPerSecond,
                    bitsPerSecond,
                    mbps,
                    lastPackets: lastPackets[i][metricKey]
                });

                lastPackets[i][metricKey].time = currentTime;
                lastPackets[i][metricKey].value = metricValue;
            });
        }
    }, 1000);

    log.info('Sending Gauge values to reporter done');

    log.info('Done');
})();
