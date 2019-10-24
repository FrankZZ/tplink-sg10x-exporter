'use strict';

// const config = require('../config');
const log = require('./log');
const api = require('./api');
const config = require('../config');
const reporter = require('./reporter')[config.get('reporter.reporter')];

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

    log.info('Requesting portStatistics...');
    const portStats = await api.getPortStatistics();
    log.info('Requesting portStatistics done');

    log.info('Sending Gauge values to reporter...');
    let j;
    for(let i = 0; i < portStats.length; i++) {
        j = i + 1;
        reporter.setGauge(`Port${i}${metricKey}`);
    }
    log.info('Sending Gauge values to reporter done');

    log.info('Done');
})();

module.exports = 11;