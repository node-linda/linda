Linda
=====
<a href="http://en.wikipedia.org/wiki/Linda_(coordination_language)">Coordinatioin Launguage "Linda"</a> implementation for Node.js and Socket.IO

- https://github.com/node-linda/linda
- https://npmjs.org/package/linda

[![Travis CI Status Badge](https://travis-ci.org/node-linda/linda.png?branch=master)](https://travis-ci.org/node-linda/linda)
[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)


Install
-------

    % npm install linda -g
    % linda-server --help


Requirements
------------
- Node.js
- [Socket.IO](http://socket.io/) v1.0.x


Linda
-----
Linda is a coordination launguage for parallel programming.

* http://en.wikipedia.org/wiki/Linda_(coordination_language)
* http://ja.wikipedia.org/wiki/Linda


### TupleSpace
Shared memory on Node.js server.


### Tuple Operations
- write( tuple , options )
  - put a Tuple into the TupleSpace
  - options = {expire : 300}  # => expire after 300 sec
- take( tuple, callback(err, tuple) )
  - get a matched Tuple from the TupleSpace and delete
- read( tuple, callback(err, tuple) )
  - get a matched Tuple from the TupleSpace
- watch( tuple, callback(err, tuple) )
  - overwatch written Tuples in the TupleSpace


Samples
-------

- https://github.com/node-linda/linda/ree/master/samples
- https://github.com/node-linda/job-queue-sample

## Install Dependencies

    % git clone https://github.com/node-linda/linda.git
    % cd linda
    % npm install
    % npm install -g grunt-cli coffee-script


### Chat

    % coffee samples/chat/server.coffee 3000

=> http://localhost:3000


### Job-Queue

    % coffee samples/job-queue/server.coffee 3000

=> http://localhost:3000


### print Tuple read/write/take/watch/cancel logs

    % DEBUG=linda* coffee samples/chat/server.coffee 3000
    % DEBUG=linda* coffee samples/job-queue/server.coffee 3000

Usage
-----

### Setup

Server Side (node.js)

```javascript
var http = require('http');

var app_handler = function(req, res){
  // your web app code
};

var app = http.createServer(app_handler);

var io = require('socket.io').listen(app);

var linda = require('linda').Server.listen({io: io, server: app});

app.listen(3000);
console.log("server start - http://localhost:3000");
```


Client Side (web browser)

```html
<script src="/socket.io/socket.io.js"></script>
<script src="/linda/linda.js"></script>
```

```javascript
var socket = io.connect(location.protocol+"//"+location.host);
var linda = new Linda().connect(socket);
```

Client Side (node.js)

```javascript
var LindaClient = require('linda').Client;
var socket = require('socket.io-client').connect('http://localhost:3000');
var linda = new LindaClient().connect(socket);
```


### Job-Queue Sample

job client

```javascript
// connect to tuplespace (shared memory)
var ts = linda.tuplespace("calc");

// request
$("#btn_request").click(function(){
  ts.write({type: "request", query: "1-2+3*4"});
});

// wait result
socket.on('connect', function(){
  // overwatch Tuple
  ts.watch({type: 'result'}, function(err, tuple){
    if(err) return;
    console.log(tuple.data.result); // => "1-2+3*4 = 11"
  });
});
```


job worker
```javascript
// connect to tuplespace (shared memory)
var ts = linda.tuplespace("calc");

// calculate
var work = function(){
  ts.take({type: 'request'}, function(err, tuple){
    if(!err){
      var result = eval(tuple.data.query); // => "1-2+3*4"
      console.log(tuple.data.query+" = "+result); // => "1-2+3*4 = 11"
      ts.write({type: 'result', result: result}); // return to 'client' side
    }
    work(); // recursive call
  });
};

socket.on('connect', function(){ // Socket.IO's "connect" event
  work();
});
```

see more [samples](https://github.com/node-linda/linda/tree/master/samples)


Test
----

    % npm install
    % npm install -g grunt-cli coffee-script
    % grunt test

watch

    % grunt



Contributing
------------
1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
