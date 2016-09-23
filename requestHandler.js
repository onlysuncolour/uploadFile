var querystring = require("querystring"),
 fs = require("fs"),
 formidable = require("formidable"),
 path = require('path'),
 q = require('q');
// var filePath = "P:\\ytxolap\\public\\pdfObjectDemo\\report\\",
//     tempPath = filePath + "temp\\";
var filePath = "/Users/zhaoyang.liu/Desktop/myThing/uploadFile/pdf/",
    tempPath = filePath + "temp/"
// var filePath = "/opt/data/olap-server/ytx_olap/public/pdfObjectDemo/report/",
//     tempPath = filePath + "temp/";
var fileName = "";
var userFileName = "./users.json"

function login(response) {
  fs.readFile('login.html', function(err, data) {
    response.writeHead(200,{"Content-Type": 'text/html'});
    response.end(data)
  })
}

function checkLogin(response, request) {
  var cookies = getCookies(request);
  var users = getUsers();
  if (checkSession(cookies, users)) {
    response.writeHead(200,{"Content-Type": "application/json"});
    response.write(JSON.stringify({
      success: true,
      username: cookies.USER})
    );
    response.end();
  } else {
    response.writeHead(200,{"Content-Type": "application/json"});
    response.write('{"success": false}');
    response.end();
  }
}

function checkSession(cookies, users) {
  if (!!cookies && !!cookies.USER && !!cookies.SESSION) {
    if (users[cookies.USER].cookie == cookies.SESSION) {
      var sessionDate = +cookies.SESSION.substring(5,18);
      var date = new Date();
      date.setDate(date.getDate()-1);
      if (sessionDate > date.getTime()) {
        return true
      }
    }
  }
  return false;
}

function main(response) {
  fs.readFile('upload.html', function(err, data) {
    response.writeHead(200,{"Content-Type": 'text/html'});
    response.end(data)
  })
}

function setCookie (username) {
  var users = getUsers();
  var user = users[username];
  user.cookie = getRandom() + (new Date().getTime() + "") + getRandom();
  var cookies = ["USER=" + username + "; " , "SESSION=" + user.cookie + "; "];
  exportUsers(users);
  return cookies;
}

function getRandom () {
  var random = parseInt(Math.random()*100000);
  if (random < 10000) {
    return getRandom();
  } else {
    return (random + "");
  }
}

function userLogin(response, request, postData) {
  var user = getUserFromPostData(postData),
    users = getUsers();
  if (!!users[user.username] && !!user.password && users[user.username].password == user.password) {
    var cookie = setCookie(user.username);
    // console.log(cookie);
    fs.readFile('upload.html', function(err, data) {
      response.writeHead(200,{"Content-Type": 'text/html', "Set-Cookie": cookie});
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
    fileName = fields.year + "年" + fields.month + "月";
    fs.unlink(filePath+fileName+".pdf", function(err) {
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
  var cookies = getCookies(request);
  var users = getUsers();
  if (checkSession(cookies, users) && cookies.USER == 'root') {
    var passwords = getObjFromPostData(postData);
    // console.log(passwords);
    if (users[cookies.USER].password == passwords.password) {
      users[cookies.USER].password = passwords.newpassword;
      exportUsers(users).then(function() {
        response.writeHead(200,{"Content-Type": "application/json"});
        response.write('{"success": false}');
        response.end();
      }, function() {
        response.writeHead(200,{"Content-Type": "application/json"});
        response.write('{"success": true}');
        response.end();
      })
      return;
    }
  }
  response.writeHead(200,{"Content-Type": "application/json"});
  response.write('{"success": false}');
  response.end();
  return;
}

var manageUser = function(response, request, postData) {
  var cookies = getCookies(request);
  var users = getUsers();
  if (checkSession(cookies, users)) {
    var changedUser = getObjFromPostData(postData);
    users[changedUser.username] = {};
    users[changedUser.username].password = changedUser.upassword;
    exportUsers(users).then(function() {
      response.writeHead(200,{"Content-Type": "application/json"});
      response.write('{"success": false}');
      response.end();
    }, function() {
      response.writeHead(200,{"Content-Type": "application/json"});
      response.write('{"success": true}');
      response.end();
    })
    return;
  }
  response.writeHead(200,{"Content-Type": "application/json"});
  response.write('{"success": false}');
  response.end();
  return;
}

var exportUsers = function(users) {
  var defer = q.defer();
  fs.writeFile(userFileName, JSON.stringify(users, null, 4), function(err) {
    if(err) {
      console.log(err);
      defer.reject(err)
    } else {
      users = getUsers();
      defer.resolve();
    }
  });
  return defer.promise;
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

var getObjFromPostData = function(postData) {
  var obj = {};
  var splitCh = postData.indexOf('+&') == -1 ? "&" : "+&";
  postData = postData.split(splitCh);
  for (var i = 0; i < postData.length; i++) {
    obj[decodeURIComponent(postData[i].split("=")[0])] = decodeURIComponent(postData[i].split("=")[1]);
  };
  return obj;
}

var getCookies = function(request) {
  if (!request.headers.cookie) {
    return null
  }
  var cookieString = request.headers.cookie;
  var cookieArr = cookieString.split('; ');
  var cookies = {};
  for (var i = 0; i < cookieArr.length; i++) {
    cookies[cookieArr[i].split('=')[0]] = cookieArr[i].split('=')[1]
  }
  return cookies;
}

var getUsers = function() {
  var users = require(userFileName);
  return users;
}

exports.main = main;
exports.upload = upload;
exports.getFile = getFile;
exports.showList = showList;
exports.unlinkFile = unlinkFile;
exports.login = login;
exports.userLogin = userLogin;
exports.changePassword = changePassword;
exports.checkLogin = checkLogin;
