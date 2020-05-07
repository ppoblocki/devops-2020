const express = require('express');

const app = express();

const myId = Math.floor(Math.random() * 100); 

app.get('/', (req, res) => {
  res.send(String(myId));		
});

app.listen(8080, () => {
	console.log("Listening on port 8080\n");
});
