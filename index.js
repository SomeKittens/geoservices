'use strict';

var request = require('request')
  , xml2js = require('xml2js');

var apiKey, version;

var funcs = {
  normalize: function(addressObj, cb) {
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
  validate: function(addressObj, cb) {
    var endpoint = 'http://app.yurisw.com/YAddressWebService/YAddress.asmx/ProcessJson'
      , line1, line2;

    if (!addressObj.line1) {
      line1 = addressObj.street1 + ' ' + addressObj.street2;
      line2 = addressObj.city + ' ' + addressObj.state + ' ' + addressObj.zip;
    } else {
      line1 = addressObj.line1;
      line2 = addressObj.line2;
    }

    request({
      url: endpoint,
      qs: {
        AddressLine1: line1,
        AddressLine2: line2,
        UserKey: ''
      }
    }, function(err, incomingMessage, response) {
      if (err) { return cb(err); }
      if (incomingMessage.statusCode < 200 || incomingMessage.statusCode > 299) {
        return cb(incomingMessage.statusCode);
      }

      try {
        response = JSON.parse(response);
      } catch (e) {
        return cb(e);
      }

      if (response.ErrorMessage) {
        return cb(response.ErrorMessage);
      }
      cb(null, JSON.parse(response));
    });
  }
};

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