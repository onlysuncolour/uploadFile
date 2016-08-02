var http = require("http");
var url = require("url");
function start(route, handle) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");
    var type = checkRequestType(request);
    if (type == 'POST') {
      var postData = "";
      request.setEncoding("utf8");
      request.addListener("data", function(postDataChunk) {
        postData += postDataChunk;
      });
      request.addListener("end", function() {
        route(handle, pathname, response, request, postData);
      });
    } else {
      route(handle, pathname, response, request);
    }
  }
    http.createServer(onRequest).listen(8765);
}

function checkRequestType(request) {
  if (request.method == 'GET') {
    return 'GET';
  } else if (request.method == 'POST') {
    if (request.headers['content-type'].indexOf('multipart/form-data;') == -1) {
      return 'POST';
    } else {
      return 'POST-FILE';
    }
  } else {
    return request.method;
  }
}

exports.start = start;
