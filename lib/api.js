'use strict';

const request = require('request-promise');

const config = require('../config');
const log = require('./log');

const baseRequestObject = (method, path) => ({
    url: `http://${config.get('switch.host')}/${path}`,
    method,
    headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36'
    }
});

const login = () => {
    const reqObj = baseRequestObject('POST', 'logon.cgi');
    reqObj.form = {
        username: config.get('switch.user'),
        password: config.get('switch.password'),
        logon: 'Login'
    };

    log.debug({reqObj}, 'Created reqObj for login');

    return request(reqObj)
        .then((res) => {
            log.info({
                body: res
            }, 'Got login response');
        });
};

const getPortStatistics = () => {
    const reqObj = baseRequestObject('GET', 'PortStatisticsRpm.htm');

    log.debug({reqObj}, 'Created reqObj for getPortStatistics');

    return request(reqObj)
        .then((body) => {
            log.info({
                body
            }, 'Got portStatistics response');
            return body;
        })
        .then((body) => {
            const pktsRegex = /pkts\:\[([0-9,]+)\]/;
            const pktsString = (body.match(pktsRegex) || ['', ''])[1];
            log.debug({
                pktsString
            }, 'Got pktsString');

            const pkts = pktsString.split(',');
            log.debug({
                pkts,
                length: pkts.length
            }, 'Got pkts');

            if (pkts.length < (8 * 4)) {
                throw Error('Unexpected response for portStatisticsRpm.htm');
            }

            const results = [];

            for(let i  = 0; i + 4 <= pkts.length; i += 4) {
                results.push({
                    TxGoodPkt: parseInt(pkts[i], 10),
                    TxBadPkt: parseInt(pkts[i + 1], 10),
                    RxGoodPkt: parseInt(pkts[i + 2], 10),
                    RxBadPkt: parseInt(pkts[i + 3], 10)
                });
            }

            log.debug({
                results
            }, 'Got results');
        });
};

module.exports = {
    login,
    getPortStatistics
};
