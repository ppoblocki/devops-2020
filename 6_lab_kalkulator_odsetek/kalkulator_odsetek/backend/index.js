const url = require('url');
const keys = require('./keys');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

// REDIS SETUP
const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort
});

// PostgreSQL SETUP
const { Pool } = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});

pgClient.on('error', () => console.log('No connection to PostgreSQL Database!'));

pgClient.query('CREATE TABLE IF NOT EXISTS wyniki(' +
                            'kapital FLOAT, ' +
                            'procent FLOAT, ' +
                            'miesiace INT, ' +
                            'odsetki FLOAT);').catch(err => console.log(err));

// Kalkulator odsetek lokat bankowych
app.get('/:k/:o/:m', (req, resp) => {

    // Parametry
    var kapital = req.params.k.replace(",", ".");
    var oprocentowanie = (req.params.o).replace(",", ".");
    var miesiace = req.params.m;

    var redis_key = kapital+"-"+oprocentowanie+"-"+miesiace;

    redisClient.get(redis_key, (err, result) => {
        if (result) // exists in Redis
        {
            console.log("[REDIS] Getting result from cache...");
            resp.send(result.toString().replace(".", ","));
        }
        else
            {
                var odsetki = 0.0;

                // Logika
                odsetki = ((((oprocentowanie / 1200) * miesiace) * kapital) * 0.81).toFixed(2);

                // PostgreSQL
                var query_string = "INSERT INTO wyniki (kapital, procent, miesiace, odsetki) " +
                    "VALUES ('" + kapital + "', '" + oprocentowanie + "', '" + miesiace + "', '" + odsetki +"');";
                console.log("[PostgreSQL] Executing query...");
                console.log("[PostgreSQL] " + query_string);
                pgClient.query(query_string).catch(err => console.log(err));

                // Redis
                console.log("[REDIS] Inserting key-value...");
                console.log("[REDIS]" + redis_key + " ==> " + odsetki);
                redisClient.set(redis_key, odsetki);

                // Response
                resp.send(odsetki.toString().replace(".", ","));
            }
    });
});

app.get('/', (req, resp) => {
    resp.send('Hello from Kalkulator odsetek lokat API :D');
});

app.listen(4000, err => {
    console.log('Server is listening on port 4000');
});
