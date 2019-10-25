'use strict';

const bunyan = require('bunyan');
const config = require('../config');

const log = bunyan.createLogger({
    name: config.get('name'),
    level: 'info'
});

module.exports = log;
