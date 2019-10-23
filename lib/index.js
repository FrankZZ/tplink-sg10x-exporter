'use strict';

// const config = require('../config');
const log = require('./log');
const api = require('./api');

(async () => {
    log.info('Logging in...');
    await api.login();
    log.info('Logging in done');
    await api.getPortStatistics();
    
})();
