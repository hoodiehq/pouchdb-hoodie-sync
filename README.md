# pouchdb-hoodie-sync

> Hoodie-like sync API for PouchDB

This [PouchDB](http://pouchdb.com/) plugin provides simple methods to
keep two databases in sync.

## Usage

```js
// Initialisation
var db = new PouchDB('dbname')
var api = db.hoodieSync({
  remote: 'http://example.com/mydb'
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
api.on('connect', function(doc) {})
api.on('disconnect', function(doc) {})
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

### In the browser

```
test:browser:local
```

This will start a local server. All tests and coverage will be run at [http://localhost:8080/__zuul](http://localhost:8080/__zuul)

## Contributing

Have a look at the Hoodie project's [contribution guidelines](https://github.com/hoodiehq/hoodie-dotfiles/blob/master/static/CONTRIBUTING.md).
If you want to hang out you can join #hoodie-pouch on our [Hoodie Community Slack](http://hood.ie/chat/).
