var querystring = require("querystring"),
 fs = require("fs"),
 formidable = require("formidable"),
 path = require('path');
// var filePath = "P:\\ytxolap\\public\\pdfObjectDemo\\report\\",
//     tempPath = filePath + "temp\\";
var filePath = "/Users/zhaoyang.liu/Desktop/myThing/uploadFileNode/pdf/",
    tempPath = filePath + "temp/"
// var filePath = "/opt/data/olap-server/ytx_olap/public/pdfObjectDemo/report/",
//     tempPath = filePath + "temp/";
var fileName = "";
var users = require('./users.json')

function login(response) {
  fs.readFile('login.html', function(err, data) {
    response.writeHead(200,{"Content-Type": 'text/html'});
    response.end(data)
  })
}

function main(response) {
  fs.readFile('upload.html', function(err, data) {
    response.writeHead(200,{"Content-Type": 'text/html'});
    response.end(data)
  })
}

function setCookie (username, cookie) {
  
}

function userLogin(response, request, postData) {
  var user = getUserFromPostData(postData);
  if (!!users[user.username] && !!user.password && users[user.username] == user.password) {
    fs.readFile('upload.html', function(err, data) {
      response.writeHead(200,{"Content-Type": 'text/html', "Set-Cookie": "session=E1f3Vo"});
      response.end(data)
    })
  } else {
    response.writeHead(401,{"Content-Type": "application/json"});
    response.write('{"success": false}');
    response.end();
  }
  return;
}

function upload(response, request) {
  var form = new formidable.IncomingForm();
  form.uploadDir=tempPath;
  form.parse(request, function(error, fields, files) {
    fs.unlink(filePath+fileName+".pdf", function(err) {
      fileName = fields.year + "年" + fields.month + "月";
      fs.renameSync(files.fileName.path, filePath+fileName+".pdf", function(err) {
        response.writeHead(200,{"Content-Type": "application/json"});
        response.write('{"success": false}');
        response.end();
        return;
      });
      response.writeHead(200,{"Content-Type": "application/json"});
      response.write('{"success": true}');
      response.end();
    });
  });
}

function getFile (response, request) {
  var requestFileName = request.url.split('/')[1];

  fs.readFile(requestFileName, function(err, data) {
    if (!!err) {
      fs.readFile('login.html', function(err, data) {
        response.writeHead(200,{"Content-Type": 'text/html'});
        response.end(data)
      })
    } else {
      response.writeHead(200,{"Content-Type": 'text/javascript'});
      response.end(data)
    }
  })
}

function showList (response) {
  fs.readdir(filePath,function(err, files) {
    if(err) {
      response.writeHead(200,{"Content-Type": "application/json"});
      response.write('{"success": false}');
      response.end();
    } else {
      response.writeHead(200,{"Content-Type": "application/json"});
      var fileNames = files.join('","');
      fileNames = '"' + fileNames + '"';
      response.write('{"fileList":[' + fileNames + ']}');
      response.end();
    }
  })
}

function unlinkFile (response, request) {
  var unlinkFileName = makeObjectFromGet(request.url, '/unlinkFile').fileName;
  fs.unlink(filePath+unlinkFileName, function(err) {
    if (!!err) {
      response.writeHead(200,{"Content-Type": "application/json"});
      response.write('{"success": false}');
      response.end();
    } else {
      response.writeHead(200,{"Content-Type": "application/json"});
      response.write('{"success": true}');
      response.end();
    }
  });
}

var makeObjectFromGet = function(url, urlBase) {

  var params = url.split(urlBase+'?')[1].split('&');
  var object = {};
  for (var i = 0; i < params.length; i++) {
    var each = params[i].split('=');
    object[decodeURIComponent(each[0])] = decodeURIComponent(each[1]);
  }
  return object;
}

var changePassword = function(response, request, postData) {
  var user = getUserFromPostData(postData);
  if (users[user.username] == null || users[user.username] == undefined) {
    response.writeHead(200,{"Content-Type": "application/json"});
    response.write('{"success": false}');
    response.end();
    return;
  }
  users[user.username] = user.password;
  var outputFilename = './users.json';
  fs.writeFile(outputFilename, JSON.stringify(users, null, 4), function(err) {
    if(err) {
      console.log(err);
      users = require(outputFilename);
      response.writeHead(200,{"Content-Type": "application/json"});
      response.write('{"success": false}');
      response.end();
    } else {
      users = require(outputFilename);
      response.writeHead(200,{"Content-Type": "application/json"});
      response.write('{"success": true}');
      response.end();
    }
  });
}

var addUser = function(response, request, postData) {
  var user = getUserFromPostData(postData);
  if (!!users[user.username]) {
    response.writeHead(200,{"Content-Type": "application/json"});
    response.write('{"success": false, "reason": "username existed!"}');
    response.end();
    return
  } else {
    users[user.username] = user.password;
    var outputFilename = './users.json';
    fs.writeFile(outputFilename, JSON.stringify(users, null, 4), function(err) {
      if(err) {
        console.log(err);
        users = require(outputFilename);
        response.writeHead(200,{"Content-Type": "application/json"});
        response.write('{"success": false, "reason": "TRY AGAIN!"}');
        response.end();
      } else {
        users = require(outputFilename);
        response.writeHead(200,{"Content-Type": "application/json"});
        response.write('{"success": true}');
        response.end();
      }
    });
  }
}

var getUserFromPostData = function(postData) {
  var user = {};
  var splitCh = postData.indexOf('+&') == -1 ? "&" : "+&";
  postData = postData.split(splitCh);
  for (var i = 0; i < postData.length; i++) {
    user[decodeURIComponent(postData[i].split("=")[0])] = decodeURIComponent(postData[i].split("=")[1]);
  };
  return user;
}

exports.main = main;
exports.upload = upload;
exports.getFile = getFile;
exports.showList = showList;
exports.unlinkFile = unlinkFile;
exports.login = login;
exports.userLogin = userLogin;
exports.changePassword = changePassword;
