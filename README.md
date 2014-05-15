#address-geoservices

A collection of wrappers around tools that help you normalize and verify physical addresses.

###Installation

    npm install --save address-geoservices

##Usage

There are two separate services provided by `address-geoservices` - normalization and correction.

###The address object:

Both `normalize` and `validate` expect to be called with two parameters: an address object with the following properties:

    {
      street: '',
      city: '',
      state: '',
      zip: ''
    }
    
and a callback.  The callback will be called with two parameters: `err` (if an error occurred, null otherwise) and an object with the results of the API call.

####Normalization

Normalization is the process of converting the parts of an address to standard abbreviations (`road` and `Rd` to `rd.`, for instance).  It is useful to conform to USPS standards as well as effectively detecting duplicates in one's data corpus.

`address-geoservices` uses the [Texas A&M Geoservices API](http://geoservices.tamu.edu/) to normalize addresses.  This requires an API keyy.  The `.initTex` function allows you to provide both a key and the desired version.  Version is optional, and will default to `4.01` if not provided.

    var geoservices = require('address-geoservices');

    geoservices.initTex('myApiKey', 'desiredAPIVersion');

Once you've called `initTex`, you can use `.normalize` to normalize a given address.

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

Once initalized, `validate` can be used as such: 

    geoservices.validate({
      street: '2301 Westside Drive',
      city: 'Rochester',
      state: 'New York',
      zip: '14624'
    }, function(err, address) {
      if (err) { console.error(err); }

      console.log(addresses);
    });