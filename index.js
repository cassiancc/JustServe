var liveServer = require("live-server");
var http = require('http');
var formidable = require('formidable');
var fs = require('fs')

//setup initial station count from stations.txt
var stations = 2
var stations = fs.readFileSync('stations.txt', 'utf8')
console.log(stations)

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

			let stationString = ""

			for (let i = 1; i <= stations; i++) { 
				stationString += 
				`<label for="station${i}"><a href="http://127.0.0.1:5500/" target="_blank" rel="noopener noreferrer">Station ${i}</a> </label>
				<select name="station${i}" id="station${i}">
					{{files}}
				</select>`
			}


			let list = ""
			files = fs.readdirSync('img'); 
			files.forEach(function(file) {
					list += `                   
					 <option value="${file}">${file}</option>
					`
					console.log(file)
			})
				
			data = data.replace("{{stations}}", stationString)
			data = data.replaceAll("{{files}}", list)
			console.log(list)



			res.write(data);
			res.end();
		  });
		
	}
	else if (req.url === "/change") {
		const form = new formidable.IncomingForm();
		form.parse(req, (err, fields, files) => {
			console.log(fields)
		let arrayFields = Object.entries(fields)
		// console.log(fields[0][1][0])

		for (let i = 1; i <= stations; i++) {
			fs.writeFileSync(`index${i}.html`, 
			`<!DOCTYPE html>
			<html>
				<head>
					<title>JustServe - Station ${i}</title>
					<link rel="stylesheet" href="css/live.css">
				</head>
				<body>
					<img id="content" src="img/${arrayFields[i-1][1][0]}" alt="">
				</body>
			</html>`)
		} 

		// fs.writeFileSync("index.html", data)
		res.write(`
		<!DOCTYPE html>
		<html lang="en-US">
		  <meta charset="utf-8">
		  <title>Redirecting&hellip;</title>
		  <link rel="canonical" href="http://localhost:3000/upload">
		  <script>location="http://localhost:3000/upload"</script>
		  <meta http-equiv="refresh" content="0; url="http://localhost:3000/upload">
		  <meta name="robots" content="noindex">
		  <h1>Redirecting&hellip;</h1>
		  <a href="http://localhost:3000/upload">Click here if you are not redirected.</a>
		</html>
		`);

		res.end();
		})
		
	}
	else if (req.url === "/api/newstation") { 
		stations = parseInt(stations) + 1
		console.log(stations)
		fs.writeFileSync("stations.txt", stations.toString())
		res.write("Station count updated.");
		res.end();
	}
	else if (req.url === "/api/rmstation") { 
		stations = parseInt(stations) - 1
		console.log(stations)
		fs.writeFileSync("stations.txt", stations.toString())
		res.write("Station count updated.");
		res.end();
	}

	//FRONTEND CSS/JS
	else if (req.url === '/css/dark.css') {
		fs.readFile('./css/dark.css', 'utf8', (err, data) => { 
			res.write(data);
			res.end();
		})


	}
	else if (req.url === '/css/frontend.css') {
		fs.readFile('./css/frontend.css', 'utf8', (err, data) => { 
			res.write(data);
			res.end();
		})
	}
	else if (req.url === '/css/desktop.css') {
		fs.readFile('./css/desktop.css', 'utf8', (err, data) => { 
			res.write(data);
			res.end();
		})
	}
	else if (req.url === '/js/frontend.js') {
		fs.readFile('./js/frontend.js', 'utf8', (err, data) => { 
			res.setHeader('Content-Type', 'text/javascript');
			res.write(data);
			res.end();
		})
	}
	//FONT AWESOME
	else if (req.url === '/css/font-awesome/css/font-awesome.min.css') {
		fs.readFile('./css/font-awesome/css/font-awesome.min.css', 'utf8', (err, data) => { 
			res.write(data);
			res.end();
		})


	}
	else if (req.url === `/css/font-awesome/fonts/fontawesome-webfont.woff?v=4.7.0`) {
		fs.readFile('./css/font-awesome/fonts/fontawesome-webfont.woff', (err, data) => { 
			res.write(data);
			res.end();
		})
	}
	else if (req.url === `/css/font-awesome/fonts/fontawesome-webfont.woff2?v=4.7.0`) {
		fs.readFile('./css/font-awesome/fonts/fontawesome-webfont.woff2', (err, data) => { 
			res.write(data);
			res.end();
		})
	}
	else if (req.url === `/css/font-awesome/fonts/fontawesome-webfont.ttf?v=4.7.0`) {
		fs.readFile('./css/font-awesome/fonts/fontawesome-webfont.ttf', (err, data) => { 
			res.write(data);
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

