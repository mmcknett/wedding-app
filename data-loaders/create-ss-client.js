const ssclient = require('smartsheet');
const { smartsheetApiToken } = require('../ss-config.json');

const ss = ssclient.createClient({
    accessToken: smartsheetApiToken,
    logLevel: 'info'
});

module.exports = ss;
