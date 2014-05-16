'use strict';

require('should');

var texKey = require('./keys.json').tex
  , geoservices = require('../');
  
var testAddress = {
  street: '2301 Westside Dr.',
  city: 'Rochester',
  state: 'New York',
  zip: '14624'
};

describe('normalize', function() {
  describe('pre init', function() {
    it('returns an error if there is no API key', function(done) {
      geoservices.normalize(testAddress, function(err, result) {
              console.log(err.message);

        err.should.be.ok;
        (result === undefined).should.be.true;
        err.should.be.an.Error;
        err.message.should.eql('No API key provided');
        done();
      });
    });
  });
  describe.skip('post init', function() {
    it('should work as normal', function(done) {
      geoservices.initTex(texKey)
      done();
    });
  });
});