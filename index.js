var server = require("./server");
var router = require("./route");
var requestHandlers = require("./requestHandler");
var handle = {}
handle["/"] = requestHandlers.login;
handle["/main"] = requestHandlers.main;
handle["/login"] = requestHandlers.login;
handle["/upload"] = requestHandlers.upload;
handle["/showList"] = requestHandlers.showList;
handle["/unlinkFile"] = requestHandlers.unlinkFile;
handle["/userLogin"] = requestHandlers.userLogin;
handle["/checkLogin"] = requestHandlers.checkLogin;
handle["/other"] = requestHandlers.getFile;
server.start(router.route, handle);
