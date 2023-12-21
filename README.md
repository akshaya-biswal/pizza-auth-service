# Docker

## Building the Docker Image 🏗️

`docker build -t auth-service:dev -f docker/dev/Dockerfile .`

## Running the Express App in a Docker Container 🚀

`docker run --rm -it -v $(pwd):/usr/src/app -v /usr/src/app/node_modules --env-file $(pwd)/.env -p 5501:5501 -e NODE_ENV=development auth-service:dev
`
