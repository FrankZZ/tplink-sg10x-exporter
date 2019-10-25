'use strict';

const convict = require('convict');

const configSchema = convict({
    port: {
        description: 'The port of the API to listen on',
        default: 8080,
        type: 'int',
        env: 'PORT'
    },
    name: {
        description: 'The name of this service',
        default: 'tplink_exporter',
        type: 'string',
        env: 'NAME'
    },
    switch: {
        user: {
            description: 'Username to log on to the TP-Link switch',
            default: 'admin',
            env: 'SWITCH_USER'
        },
        password: {
            description: 'Password to log on to the TP-Link switch',
            default: 'admin',
            env: 'SWITCH_PASSWORD'
        },
        host: {
            description: 'The host of the TP-Link switch',
            default: '192.168.0.1',
            env: 'SWITCH_HOST'
        },
        name: {
            description: 'A name to reference this switch',
            default: null,
            type: 'string',
            env: 'SWITCH_NAME'
        }
    },
    reporter: {
        reporter: {
            description: 'The reporter to use',
            type: String,
            default: 'influxdb',
            env: 'REPORTER'
        },
        influxdb: {
            host: {
                description: 'The host of the InfluxDB Server',
                default: '127.0.0.1',
                type: 'string',
                env: 'INFLUXDB_HOST'
            }
        }
    }
});

configSchema.validate();

module.exports = configSchema;
