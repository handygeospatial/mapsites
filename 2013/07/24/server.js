// server.js (node.js) CC0
var http = require('http');
var WSServer = require('websocket').server;
var clientHtml = require('fs').readFileSync('client.html');
var plainHttpServer = http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(clientHtml);
}).listen(8888);

var wss = new WSServer({httpServer: plainHttpServer});
var connections = [];

wss.on('request', function(ws) {
  var websocket = ws.accept(null, ws.origin);
  connections.push(websocket);
  websocket.on('message', function(msg) {
    console.log('received: ' + msg.utf8Data);
    console.log(connections.length);
    if(true) {
      connections.forEach(function(conn, i) {
        if(conn != websocket) {
          conn.send(msg.utf8Data);
        }
      });
    }
  });
  websocket.on('close', function(code, desc) {
    connections = connections.filter(function(conn, i) {
      return (conn == websocket) ? false : true;
    });
    console.log('connection released: ' + code + '-' + desc + ':' + 
      connections.length);
  });
});
