xhost +local:root
xhost +SI:localuser:root

# comandos
docker compose --profile java -f ./docker/docker-compose.yaml up
docker compose --profile ngrok -f ./docker/docker-compose.yaml up
