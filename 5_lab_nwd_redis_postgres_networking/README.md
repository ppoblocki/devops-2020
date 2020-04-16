Uruchamianie:

docker run --rm --name my-postgres -e POSTGRES_PASSWORD=123qaz123qaz --network my-network postgres

docker run --rm --name my-redis --network my-network redis

docker run -p 8080:8080 --env REDIS_HOST=my-redis --rm --name my-backend --network my-network -v /opt/app/node_modules -v $(pwd):/opt/app -e PGHOST=my-postgres -e PGUSER=postgres -e PGDATABASE=postgres -e PGPASSWORD=123qaz123qaz -e PGPORT=5432 <my_backend_id>

Gdy serwer działa np.

curl localhost:8080/4/2

