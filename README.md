#address-geoservices

A collection of wrappers around tools that help you normalize and verify physical addresses.

###Installation

    npm install --save address-geoservices

###Usage

There are two separate services provided by `address-geoservices` - normalization and correction.

####Normalization

Normalization is the process of converting the parts of an address to standard abbreviations (`road` and `Rd` to `rd.`, for instance).  It is useful to conform to USPS standards as well as effectively detecting duplicates in one's data corpus.

`address-geoservices` uses the [Texas A&M Geoservices API](http://geoservices.tamu.edu/) to normalize addresses.  This requires an API keyy.  The `.initTex` function allows you to provide both a key and the desired version.  Version is optional, and will default to `4.01` if not provided.

    var geoservices = require('address-geoservices');

    geoservices.initTex('myApiKey', 'desiredAPIVersion');

Once you've called `initTex`, you can use `.normalize` to normalize a given address.  `normalize` expects two arguments.  One, an object with the following properties:

 - street
 - city
 - state
 - zip

and a callback, which will be called with `err` or the returned, normalized address:

    geoservices.normalize({
      street: '2301 Westside Drive',
      city: 'Rochester',
      state: 'New York',
      zip: '14624'
    }, function(err, address) {
      if (err) { console.error(err); }

      console.log(addresses);
    });

####Validation

On the other hand, addresses can be mistyped.  `address-geoservices` provides a service to do this as well, using the [YAddress API](http://www.yurisw.com/YAddress.aspx).  YAddress has a similar way:

    var geoservices = require('address-geoservices');

    geoservices.initYaddress('myApiKey');

`validate` expects two arguments, an object like the one in `normalize`, and a callback:

    geoservices.validate({
      street: '2301 Westside Drive',
      city: 'Rochester',
      state: 'New York',
      zip: '14624'
    }, function(err, address) {
      if (err) { console.error(err); }

      console.log(addresses);
    });