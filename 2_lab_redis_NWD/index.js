const url = require('url');
const express = require('express');
const redis = require('redis');
const app = express();

const client = redis.createClient({
    host: 'redis-server',
    port: 6379
});

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

client.set("counter", 0);

app.get('/', (req, resp) => {
    client.get('counter', (err, counter) => {
        resp.send("counter = " + counter);
        client.set('counter', parseInt(counter) + 1);
    });
});

app.get('/:n1/:n2', (req, resp) => {

    client.get(req.params.n1 + "," + req.params.n2, (err, result) =>{

        if (result)
        {
            Console.log("result from cache");
            resp.send("Wynik : " + result);

        }
        else
            {
                var a = parseInt(req.params["n1"]);
                var b = parseInt(req.params["n2"]);
                var c = nwd_func(a,b);
                Console.log("calculated result");
                resp.send("Wynik : " + c);
                client.set(a+","+b, c);
            }
    });
});

app.listen(8080, () => {
    console.log("Server is listening on port 8080\n");
});
