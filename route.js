function route(handle, pathname, response, request, postData) {
  // console.log("About to route a request for " + pathname);
  if (typeof handle[pathname] === 'function') {
    handle[pathname](response, request, postData);
  } else {
    handle['/other'](response, request, postData);
  }
}
exports.route = route;
