# JustServe Digital Signage

JustServe is a tool allowing for simple, reliable digital signage using a centralized server and allowing for multiple clients.

JustServe is perfect for expos, conferences, and symposiums interested in having direct control over their signage. All a client needs is a web browser in order to connect to the main server, and the server itself can be lightweight enough
to run on a Raspberry Pi or similar.

## Requirements
- A local network or Internet access that allows for the clients to reach the server at port 3000 (or otherwise configured), and admins to reach the server at port 5500.
  - Its recommended to host the server on the Internet through a cloud service like AWS or Oracle Cloud, and use [Tailscale](https://tailscale.com) to reach the server and unblocking port 3000 on its firewall.
- A server with [NodeJS/NPM](https://nodejs.org) installed. This is recommended to be Linux, but a Windows machine should work.
- Clients with web browsers. Raspberry Pis will work, and are recommended.

## Installation
The code in this repository is the server side of JustServe. You'll need [NodeJS/NPM](https://nodejs.org) installed in order to run the server.
- To start, [download the repository](https://github.com/cassiancc/JustServe/archive/refs/heads/main.zip), and extract the ZIP file to a convenient location.
- From there, open a new terminal or Command Prompt, and navigate to that folder.
  - To navigate in the terminal, you can use the `cd` command. For example, assuming you are installing on the server on a Raspberry Pi or Linux computer with the server in your Downloads folder: `cd Downloads/JustServe-main`
- You can then run `npm install` to automatically install the required dependencies.
- To start the server, run `node server`.

By default, you can access the configuration server at [http://127.0.0.1:5500](http://127.0.0.1:5500). For each station you configure, they'll have their own web site that can be navigated to. 
For example, Station 1 would be [http://127.0.0.1:3000/index1.html](http://127.0.0.1:3000/index1.html) and Station 2 would be [http://127.0.0.1:3000/index2.html](http://127.0.0.1:3000/index2.html).

## Configuration
You can use the configuration server to upload new images, add or remove stations, and more. 
