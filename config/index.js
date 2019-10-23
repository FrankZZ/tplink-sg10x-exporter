'use strict';

const convict = require('convict');

const configSchema = convict({
    port: {
        description: 'The port of the API to listen on',
        default: 8080,
        env: 'PORT'
    },
    name: {
        description: 'The name of this service',
        default: 'tplink_exporter',
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
        }
    }
});

configSchema.validate();

module.exports = configSchema;
