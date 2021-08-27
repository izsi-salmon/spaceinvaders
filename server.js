var http = require('http');
var fs = require('fs');
var path = require('path');

ourServer = http.createServer(ourRequest);
ourServer.listen(8080);
console.log('server listening');

function ourRequest(req, res){
  var filePath;
  var contentType;

  if(req.url == '/'){
    filePath = 'public/RayGun.html';
  }
  else {
    filePath = 'public/' + req.url;
  }

  contentType = getContentType(filePath);

  res.writeHead(200, { 'content-type': contentType });
  fs.createReadStream(filePath).pipe(res);
  // console.log(req.url + ',' + contentType);
}

function getContentType(filePath){
  var fileExt = path.extname(filePath);
  switch (fileExt) {
    case '.html':
      return 'text/html';
      break;
    case '.jpg':
      return 'image/jpeg';
      break;
    case '.png':
      return 'image/png';
    case '.ico':
      return 'image/png';
    case '.mp3':
      return 'audio/mpeg';
      break;
    case '.js':
      return 'text/javascript';
      break;
    case '.css':
      return 'text/css';
      break;
    default:
      return 'text/html';
  }
}
