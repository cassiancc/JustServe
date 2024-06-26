var liveServer = require("live-server");
var http = require('http');
var formidable = require('formidable');
var fs = require('fs')


//Make sure necessary user directories exist.
if (!fs.existsSync('signage')){
    fs.mkdirSync('signage');
}
if (!fs.existsSync('config')){
    fs.mkdirSync('config');
}
if (!fs.existsSync('img')){
    fs.mkdirSync('img');
}

//setup initial station count from stations.txt
var stationCount = 2
try {
	stationCount = fs.readFileSync('./config/stations.txt', 'utf8')

}
catch {
	fs.writeFileSync('./config/stations.txt', stationCount.toString())
}

//Setup intiial station settings from stations.json
let stations = {
	station1: "testing.jpg",
	station2: "evenmoretest.jpg"
}

try {
	stations = fs.readFileSync('./config/stations.json', 'utf8')

}
catch {
	fs.writeFileSync('./config/stations.json', JSON.stringify(stations))
}

//Setup intial app configuration
const configuration = {
	configurationIP: "127.0.0.1",
	configurationPORT: "3000",
	signageIP: "127.0.0.1",
	signagePORT: "5500"
}

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
		  return;
		}
  
		// Get the temporary path of the uploaded file
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
	//Frontend configuration page
	else if (req.url === "/") {
		fs.readFile('./frontend/index.html', 'utf8', (err, data) => {
			if (err) {
			  console.error(err);
			  return;
			}

			let stationString = "", list = ""
			files = fs.readdirSync('img'); 
			files.forEach(function(file) {
					list += `                   
					 <option value="${file}">${file}</option>
					`
			})

			for (let i = 1; i <= stationCount; i++) { 
				stationString += 
				`<div class="station-individual">
				<label>
					<h3>
						Station ${i}
					</h3>
					<a href="http://${configuration.signageIP}:${configuration.signagePORT}/index${i}.html" target="_blank" rel="noopener noreferrer">
						View Station
					</a> 
				</label>
				<select name="station${i}" id="station${i}">
					${list}
				</select>
				</div>`
			}

			data = data.replace("{{stations}}", stationString)
			res.write(data);
			res.end();
		  });
		
	}
	//CONFIGURATION PAGE - CHANGE CONTENT OF FRONTEND
	else if (req.url === "/change") {
		const form = new formidable.IncomingForm();
		form.parse(req, (err, fields, files) => {
			stations = fields
			console.log(stations)
			let arrayFields = Object.entries(fields)

			//Iterate over station count
			for (let i = 1; i <= stationCount; i++) {
				//Convert station object's arrays into strings
				stations["station" + i] = arrayFields[i-1][1][0]
				const content = arrayFields[i-1][1][0]
				let embed, format;
				//find extension
				let extension = content.split(".")
				extension = extension[extension.length-1]
				extension = extension.toLowerCase()
				//check extension against supported image formats
				switch (extension) {
					//PNG
					case 'png':
						format = "image"
						break
					//APNG
					case 'apng':
						format = "image"
						break
					//JPEG
					case 'jpg':
						format = "image"
						break
					case 'jpeg':
						format = "image"
						break
					case 'pjpeg':
						format = "image"
						break
					case 'pjp':
						format = "image"
						break
					case 'jfif':
						format = "image"
						break
					//SVG
					case 'svg':
						format = "image"
						break
					//AVIF
					case 'avif':
						format = "image"
						break
					//GIF
					case 'gif':
						format = "image"
						break
					//WEBP
					case 'webp':
						format = "image"
						break
					//MP4
					case 'mp4':
						format = "video"
						break
					//MP4
					case 'webm':
						format = "video"
						break
					//MP4
					case 'ogg':
						format = "video"
						break
					default:
						format = "unknown"
			    }
				//change html based off of file format
				switch (format) {
					case 'image':
						embed =` <img id="content" src="img/${content}" alt=""></img>`
						break
					case 'video':
						embed = `<video autoplay muted src="img/${content}"></video>`
						break
					default:
						embed =` <img id="content" src="img/${content}" alt=""></img>`
						console.log("unknown image", extension, format)
				} 
				//Write new frontend pages with changed data
				fs.writeFileSync(`./signage/index${i}.html`, 
					`<!DOCTYPE html>
					<html>
						<head>
							<title>JustServe - Station ${i}</title>
							<link rel="stylesheet" href="css/live.css">
						</head>
						<body>
							${embed}
							<script src="/js/signage.js"></script>
						</body>
					</html>
				`)
			} 

			//Redirect end user to main configuration page
			res.write(`
				<!DOCTYPE html>
				<html lang="en-US">
				<meta charset="utf-8">
				<title>Redirecting&hellip;</title>
				<link rel="canonical" href="http://${configuration.configurationIP}:${configuration.configurationPORT}/">
				<script>location="http://${configuration.configurationIP}:${configuration.configurationPORT}/"</script>
				<meta http-equiv="refresh" content="0; url="http://${configuration.configurationIP}:${configuration.configurationPORT}/">
				<meta name="robots" content="noindex">
				<h1>Redirecting&hellip;</h1>
				<a href="http://${configuration.configurationIP}:${configuration.configurationPORT}/">Click here if you are not redirected.</a>
				</html>
			`);
			fs.writeFileSync("./config/stations.json", JSON.stringify(stations))
			res.end();
			})	
	}
	//Add new station
	else if (req.url === "/api/newstation") { 
		stationCount = parseInt(stationCount) + 1
		console.log(stationCount)
		fs.writeFileSync("./config/stations.txt", stationCount.toString())
		res.write("Station count updated.");
		res.end();
	}
	//Remove one station
	else if (req.url === "/api/rmstation") { 
		stationCount = parseInt(stationCount) - 1
		console.log(stationCount)
		fs.writeFileSync("./config/stations.txt", stationCount.toString())
		res.write("Station count updated.");
		res.end();
	}
	else if (req.url === '/api/stations') {
		fs.readFile('./config/stations.json', 'utf8', (err, data) => { 
			res.write(data);
			res.end();
		})
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
  // Listen on user defined port
  server.listen(configuration.configurationPORT, () => {
	console.log('Configuration server is running on port ' + configuration.configurationPORT);
  });


  
//Live server configuration for frontend signage.
var params = {
	port: configuration.signagePORT, // Set the server port. Defaults to 8080.
	host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
	open: false, // When false, it won't load your browser by default.
	ignore: 'scss,my/templates,frontend/index.html', // comma-separated string for paths to ignore
	file: "signage/index1.html", // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
	wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
	mount: [['/', './signage']], // Mount a directory to a route.
	logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
	middleware: [function(req, res, next) { next(); }] // Takes an array of Connect-compatible middleware that are injected into the server middleware stack
};
liveServer.start(params);
console.log("Signage server is running on port " + configuration.signagePORT)

