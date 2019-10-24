'use strict';
const InfluxMetrics = require('metrics-influxdb');
const Reporter = require('./index');

class InfluxDbExporter extends Reporter {

    constructor(options) {
        super(options);
        this.reporter = new InfluxMetrics.Reporter({
            protocol: 'udp',
            tags: {
                server: 'one'
            }
        });
        this.counters = {};
        this.gauges = {};
        this.meters = {};
    }

    addMeter(name) {
        const meter = new InfluxMetrics.Meter();
        this.meters[name] = meter;
        this.reporter.addMetric(name, meter);
    }

    addCounter(name) {
        const counter = new InfluxMetrics.Counter();
        this.counters[name] = counter;
        reporter.addMetric(name, counter);
    }

    incCounter(name, value) {
        this.counters[name].inc(value);
    }

    addGauge(name) {
        const gauge = new InfluxMetrics.Gauge();
        this.gauges[name] = gauge;
        this.reporter.addMetric(name, gauge);
    }


}

module.exports = InfluxDbExporter;
