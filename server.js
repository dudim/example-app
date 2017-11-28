const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use('/public', express.static(path.join(__dirname + '/public')));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

app.listen(port, error => {
	if (error) {
		console.error(error);
	} else {
		console.info('==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);
	}
});