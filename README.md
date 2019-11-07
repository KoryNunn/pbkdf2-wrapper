# pbkdf2-wrapper
[![Build Status](https://travis-ci.org/markwylde/pbkdf2-wrapper.svg?branch=master)](https://travis-ci.org/markwylde/pbkdf2-wrapper)
[![David DM](https://david-dm.org/markwylde/pbkdf2-wrapper.svg)](https://david-dm.org/markwylde/pbkdf2-wrapper)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/markwylde/pbkdf2-wrapper)
[![GitHub package.json version](https://img.shields.io/github/package-json/v/markwylde/pbkdf2-wrapper)](https://github.com/markwylde/pbkdf2-wrapper/releases)
[![GitHub](https://img.shields.io/github/license/markwylde/pbkdf2-wrapper)](https://github.com/markwylde/pbkdf2-wrapper/blob/master/LICENSE)

A light wrapper around the native inbuilt pbkdf2 crypto functions used for password hashing.

## Installation
```bash
npm install --save pbkdf2-wrapper
```

## Example Usage
```javascript
const pbkdf2 = require('pbkdf2-wrapper')

const config = {
  encoding: 'hex',
  digest: 'sha256',
  hashBytes: 32,
  saltBytes: 16,
  iterations: 372791
}

// config is optional, if not passed will use the above as defaults
const password = await passwordHash.hash('test-password', config)
const equality = await passwordHash.verify('test-password', password, config)

equality === true
```

## License
This project is licensed under the terms of the MIT license.
