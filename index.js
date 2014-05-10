'use strict';

var request = require('request')
  , xml2js = require('xml2js');

var apiKey, version;

module.exports = function(_apiKey, _version) {
  if (!_apiKey) {
    throw new Error('apiKey is required');
  }
  if (!_version) {
    version = '4.01';
  } else {
    version = _version;
  }
  apiKey = _apiKey;
  return funcs;
};

var funcs = {
  normalizeAddress: function(addressObj, cb) {
    var endpoint = 'https://geoservices.tamu.edu/Services/AddressNormalization/WebService/v04_01/HTTP/default.aspx';

    request({
      url: endpoint,
      qs: {
        version: version,
        apiKey: apiKey,
        nonParsedStreetAddress: addressObj.street,
        nonParsedCity: addressObj.city,
        nonParsedState: addressObj.state,
        nonParsedZip: addressObj.zip,
        // API docs have JSON format, but that errors out
        responseFormat: 'xml'
      }
    }, function(err, incomingMessage, response) {
      if (err) { cb(err); }

      xml2js.parseString(response, cb);
    });
  },
  validateAddress: function(addressObj, cb) {
    var endpoint = 'http://app.yurisw.com/YAddressWebService/YAddress.asmx/ProcessJson';

    request({
      url: endpoint,
      qs: {
        AddressLine1: addressObj.line1,
        AddressLine2: addressObj.line2,
        UserKey: ''
      }
    }, function(err, incomingMessage, response) {
      if (err) { cb(err); }

      cb(null, JSON.parse(response));
    })
  }
};