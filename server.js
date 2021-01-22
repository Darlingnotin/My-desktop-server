const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})
var serverPort;
readline.question('Enter the port you would like the server to be on. ', port => {
  serverPort = `${port}`;
  serverPort = parseInt(serverPort, 10);
  readline.close();
  console.clear();
  StartHttpServer();
});
function StartHttpServer() {
  var os = require("os");
  fs = require("fs")
  var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs")
  port = process.argv[2] || serverPort;
  const testFolder = './MyFiles/';
  var elementId = elementId;
  var copyTextInElement = function copyTextToClipboard(elementId) {
    var text = document.getElementById(elementId).innerText;
    var elem = document.createElement("textarea");
    document.body.appendChild(elem);
    elem.value = text;
    elem.select();
    document.execCommand("copy");
    document.body.removeChild(elem);
    alert("Copied address to clipboard");
  }
  http.createServer(function (request, response) {

    var uri = url.parse(request.url).pathname
      , filename = path.join(process.cwd(), uri);

    var contentTypesByExtension = {
      '.html': "text/html",
      '.css': "text/css",
      '.js': "text/javascript"
    };
    var pageData = "<html><head></head><body><h1 style=\"color: rgb(39, 202, 39);\">My desktop server</h1>";
    var entityNumber = 1;
    switch (uri) {
      case "/":
        var portInUrl;
        if (serverPort === 80) {
          portInUrl = "";
        } else {
          portInUrl = ":" + serverPort;
        }
        fs.readdir(testFolder, (err, files) => {
          if (files == undefined) {
            pageData = pageData + "<h2>MyFiles Folder doesn't exist. Please create it in the same directory as your server.js file.</h2></body></html>";
            sendPage(pageData);
            return;
          } else if (files.length === 0) {
            pageData = pageData + "<h2>MyFiles Folder empty.</h2></body></html>";
            sendPage(pageData);
            return;
          }
          files.forEach(file => {
            pageData = pageData + "<h2 id=\"" + "element" + entityNumber + "\" onclick=\"copyTextToClipboard('" + "element" + entityNumber + "')\">http://" + os.networkInterfaces().Ethernet[1].address + portInUrl + "/MyFiles/" + file + "</h2>";
            entityNumber++;
          });
          sendPage(pageData + "<script>" + copyTextInElement + "</script></body></html>");
        });
        return;
    }

    function sendPage(pageData) {
      response.writeHead(200, { "Content-Type": "text/html" });
      response.write(pageData);
      response.end();
    }

    fs.exists(filename, function (exists) {
      if (!exists) {
        response.writeHead(404, { "Content-Type": "text/plain" });
        response.write("404 Not Found\n");
        response.end();
        return;
      }

      fs.readFile(filename, "binary", function (err, file) {
        if (err) {
          response.writeHead(500, { "Content-Type": "text/plain" });
          response.write(err + "\n");
          response.end();
          return;
        }

        var headers = {};
        var contentType = contentTypesByExtension[path.extname(filename)];
        if (contentType) headers["Content-Type"] = contentType;
        response.writeHead(200, headers);
        response.write(file, "binary");
        response.end();
      });
    });
  }).listen(parseInt(port, 10));
  if (serverPort === 80) {
    console.log("You can find the urls of your server content at http://localhost");
  } else {
    console.log("You can find the urls of your server content at http://localhost:" + serverPort);
  }
}
