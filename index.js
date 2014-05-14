'use strict';

var request = require('request')
  , xml2js = require('xml2js');

var yuriKey = ''
  , texVersion = '4.01'
  , texKey;

var funcs = {
  normalize: function(addressObj, cb) {
    if (!texKey) { throw new Error('No API key provided'); }

    var endpoint = 'https://geoservices.tamu.edu/Services/AddressNormalization/WebService/v04_01/HTTP/default.aspx';

    request({
      url: endpoint,
      qs: {
        version: texVersion,
        apiKey: texKey,
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
        UserKey: yuriKey
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
  },
  initTex: function(_texKey, _texVersion) {
    if (_texKey) {
      texKey = _texKey;
    } else {
      throw new Error('API key is required');
    }
    if (_texVersion) {
      texVersion = _texVersion;
    }
  },
  initYaddress: function(_yuriKey) {
    if (_yuriKey) {
      yuriKey = _yuriKey;
    } else {
      throw new Error('API key is required');
    }
  }
};

module.exports = funcs;