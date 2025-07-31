const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Application</title>
    </head>
    <body>
        <h1>Welcome to the Application</h1>
        <p>The app is now running successfully!</p>
    </body>
    </html>
  `);
});

const port = process.env.PORT || 4200;
server.listen(port, () => {
  console.log(\`Server running on port \${port}\`);
});