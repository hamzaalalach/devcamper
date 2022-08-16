"use strict";
const NodeGeocoder = require('node-geocoder');
const { geocoder } = require('../config');
const options = {
    provider: geocoder.GEOCODER_PROVIDER,
    httpAdapter: 'https',
    apiKey: geocoder.GEOCODER_API_KEY,
    formatter: null,
};
module.exports = NodeGeocoder(options);
//# sourceMappingURL=geocoder.js.map