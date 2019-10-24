'use strict';

class Exporter {
    constructor(options) {
        this.options = options;
    }

    addCounter() {
        throw new Error('This method should be implemented by the subclass.');
    }

    incCounter() {
        throw new Error('This method should be implemented by the subclass.');
    }

    addGauge() {
        throw new Error('This method should be implemented by the subclass.');
    }

    setGauge() {
        throw new Error('This method should be implemented by the subclass.');
    }

    addMeter() {
        throw new Error('This method should be implemented by the subclass.');
    }
};

module.exports = {
    Exporter,
    influxdb: require('./influxdb.reporter').InfluxDbReporter
};
