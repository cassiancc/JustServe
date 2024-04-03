var liveServer = require("live-server");
var http = require('http');
var formidable = require('formidable');
var fs = require('fs')

// Create an HTTP server
const server = http.createServer((req, res) => {
	// Check if the request is for file upload
	if (req.url === '/upload' && req.method.toLowerCase() === 'post') {
	  // Initialize formidable form parser
	  const form = new formidable.IncomingForm();
  
	  // Set the upload directory
	  form.uploadDir = "./img";
  
	  // Parse the incoming form data
	  form.parse(req, (err, fields, files) => {
		if (err) {
		  res.writeHead(500, { 'Content-Type': 'text/plain' });
		  res.end('Internal Server Error');
		  console.log(files)
		  return;
		}
  
		// Get the temporary path of the uploaded file
		console.log(files)
		const oldPath = files.file[0].filepath;
  
		// Generate a new path for the uploaded file
		const newPath = form.uploadDir + "/" + files.file[0].originalFilename;
  
		// Move the uploaded file to the images directory
		fs.rename(oldPath, newPath, (err) => {
		  if (err) {
			res.writeHead(500, { 'Content-Type': 'text/plain' });
			res.end('Internal Server Error');
			return;
		  }
  
		  // Respond with a success message
		  res.writeHead(200, { 'Content-Type': 'text/plain' });
		  res.end('File uploaded successfully');
		});
	  });
  
	  return;
	}
	else if (req.url === "/upload") {
		fs.readFile('./frontend/index.html', 'utf8', (err, data) => {
			if (err) {
			  console.error(err);
			  return;
			}

			list = ""
			files = fs.readdirSync('img'); 
			files.forEach(function(file) {
					list += `                   
					 <option value="${file}">${file}</option>
					`
					console.log(file)
			})
				
			data = data.replace("{{files}}", list)
			console.log(list)



			res.write(data);
			res.end();
		  });
		
	}
	else if (req.url === "/change") {
		const form = new formidable.IncomingForm();
		form.parse(req, (err, fields, files) => {
			console.log(fields)
		let data = `
		<!DOCTYPE html>
		<html>
			<head>
				<title>JustServe - Station 1</title>
				<link rel="stylesheet" href="css/live.css">
			</head>
			<body>
			<img id="content" src="img/${fields.station1}" alt="">
			</body>
		</html>`;
		fs.writeFileSync("index.html", data)
		res.write("Data submitted");
		res.end();
		})
		
	}
	else {
	// If the request is not for file upload or invalid route
	res.writeHead(404, { 'Content-Type': 'text/plain' });
	res.end('Not Found');
	}
  

  });
  
  // Listen on port 3000
  server.listen(3000, () => {
	console.log('Server is running on port 3000');
  });


  

var params = {
	port: 5500, // Set the server port. Defaults to 8080.
	host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
	open: false, // When false, it won't load your browser by default.
	ignore: 'scss,my/templates', // comma-separated string for paths to ignore
	file: "index.html", // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
	wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
	mount: [['/components', './node_modules']], // Mount a directory to a route.
	logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
	middleware: [function(req, res, next) { next(); }] // Takes an array of Connect-compatible middleware that are injected into the server middleware stack
};
liveServer.start(params);
console.log("JustServe development build running...")