# pouchdb-hoodie-sync

> Hoodie-like sync API for PouchDB

[![Build Status](https://travis-ci.org/hoodiehq/pouchdb-hoodie-sync.svg?branch=master)](https://travis-ci.org/hoodiehq/pouchdb-hoodie-sync)
[![Coverage Status](https://coveralls.io/repos/hoodiehq/pouchdb-hoodie-sync/badge.svg?branch=master)](https://coveralls.io/github/hoodiehq/pouchdb-hoodie-sync?branch=master)
[![Dependency Status](https://david-dm.org/hoodiehq/pouchdb-hoodie-sync.svg)](https://david-dm.org/hoodiehq/pouchdb-hoodie-sync)
[![devDependency Status](https://david-dm.org/hoodiehq/pouchdb-hoodie-sync/dev-status.svg)](https://david-dm.org/hoodiehq/pouchdb-hoodie-sync#info=devDependencies)


This [PouchDB](http://pouchdb.com/) plugin provides simple methods to
keep two databases in sync.

## Usage

```js
// Initialisation
var db = new PouchDB('dbname')
var api = db.hoodieSync({
  // remote can be
  // - local db name
  // - remote URL
  // - PouchDB instance
  // - a promise that resolves to one of the 3 above
  remote: 'http://example.com/mydb',
  // pass own EventEmitter instance if you want,
  // otherwise creates its own
  emitter: emitter
})

// starts / stops continuous replication
api.connect()
api.disconnect()
api.isConnected()

// resolve with pulled docs[]
api.pull()
api.pull([doc1, id2])

// resolve with pushed docs[]
api.push()
api.push([doc1, id2])

// resolve with synced docs[]
api.sync()
api.sync([doc1, id2])

// events
api.on('pull', function(doc) {})
api.on('push', function(doc) {})
api.on('connect', function() {})
api.on('disconnect', function() {})
```

If you need to customise the request to the server, e.g. set custom header for
authorisation, you can use `PouchDB.defaults{ajax}`:

```js
var MyPouch = PouchDB.defaults({
  ajax: {
    headers: {
      authorization: 'Basic QWxhZGRpbjpPcGVuU2VzYW1l'
    }
  }
})
```

### In the browser

```html
<script src="pouchdb.js"></script>
<script src="pouchdb-hoodie-sync.js"></script>
```

### In node.js

```js
var PouchDB = require('pouchdb')
PouchDB.plugin( require('pouchdb-hoodie-sync') )
```

## Testing

### In Node.js

Run all tests and validates JavaScript Code Style using [standard](https://www.npmjs.com/package/standard)

```
npm test
```

To run only the tests

```
npm run test:node
```

Run tests from single file

```
node test/unit/connect-test.js
```

## Contributing

Have a look at the Hoodie project's [contribution guidelines](https://github.com/hoodiehq/hoodie-dotfiles/blob/master/static/CONTRIBUTING.md).
If you want to hang out you can join #hoodie-pouch on our [Hoodie Community Slack](http://hood.ie/chat/).

## License

[Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0)
