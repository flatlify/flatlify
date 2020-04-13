const server = require('flatlify-server');

const path = require('path');

const app = server({ dbDir: `${__dirname}/db` });
