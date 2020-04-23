const url = require('url');

const keys = require('./keys');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort
});

const { Pool } = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});

pgClient.on('error', () => console.log('No connection to PostgreSQL Database!'));

pgClient.query('CREATE TABLE IF NOT EXISTS result(number INT)').catch(err => console.log(err));

var nwd_func = function(x, y) {

    x = Math.abs(x);
    y = Math.abs(y);

    while(y) {
        var t = y;
        y = x % y;
        x = t;
    }
    return x;
};

app.get('/:n1/:n2', (req, resp) => {

    redisClient.get(req.params.n1 + "," + req.params.n2, (err, result) =>{

        if (result)
        {
            console.log("result from redis cache\n");
            console.log("no need to add result to postgres (result already exists)\n");
            resp.send("Wynik : " + result);
        }
        else
        {
            var a = parseInt(req.params["n1"]);
            var b = parseInt(req.params["n2"]);
            var c = nwd_func(a,b);
            console.log("calculated result");
            pgClient.query('INSERT INTO result (number) VALUES (' + c + ");").catch(err => console.log(err));
            console.log("inserting into postgres...");
            resp.send("Wynik : " + c);
            redisClient.set(a+","+b, c);
        }
    });
});


app.get('/', (req, resp) => {
    resp.send('Hello World!!!');
});

app.listen(4000, err => {
    console.log('Server is listening on port 8080');
});
