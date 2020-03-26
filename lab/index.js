const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send("Hello from Docker node app\n");
		
});

app.listen(8080, () => {
	console.log("Listening on port 8080\n");
});
