# LIRCD Config Parser [![Build Status](https://travis-ci.org/madpilot/lircd-conf-parser.svg?branch=master)](https://travis-ci.org/madpilot/lircd-conf-parser)

This library will parse a lircd.conf file for remotes in Javascript. It should run in both NodeJS and the browser (with browserify).

# Installing

```npm install lircd-conf-parser```

# API Reference

```js
  import { default as Parser } from 'lircd-conf-parser';
  import { readFile } from 'fs';

  readFile('/path/to/lircd.conf', (err, content) => {
    try {
      var parsed = Parser.parse(content.toString());

      parsed.remotes.forEach((remote) => {
        var name = remote.name;

        remote.codes.forEach((code, value) => {
          console.log('LIRC #{code} has the value #{value}');
        });
      });
    } catch(error) {
      console.error("Couldn't parse config file: " + error);
    }
  });

```

The library supports multiple remotes. Each remote is an object with keys mapping to keys in the config file.

If values in the config file are split by multiple whitespace characters, the additionals characters gets reduced to one space.

Each remote also has multiple codes, which follow the same rules.

The library doesn't validate key names - what ever is stored will be represented.

# Tests

```npm run test```

# Contributing

Code does in /src and is cross compiled when the tests are run. Modifications to /lib will be blown away.

If you are going to submit patches, please try to make sure the tests pass, and that you have created a test covering the changes you have made

## Note on Patches/Pull Requests

* Fork the project.
* Make your feature addition or bug fix.
* Add tests for it. This is important so I don't break it in a
  future version unintentionally.
* Commit, do not mess with rakefile, version, or history.
  (if you want to have your own version, that is fine but
   bump version in a commit by itself I can ignore when I pull)
* Send me a pull request. Bonus points for topic branches.

## Copyright

Copyright (c) 2016 Myles Eftos <myles@madpilot.com.au>

Released under the ISC license. See LICENCE for full details.
