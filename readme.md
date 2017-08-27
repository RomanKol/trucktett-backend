# TruckTett Backend
Node.js && MongoDB Backend for the TruckTett Android App [TruckTett on kollatschny.net](http://www.kollatschny.net/portfolio/trucktett/)

## Developer
- [RomanKol](https://github.com/RomanKol)

## Installation
- [Install](https://nodejs.org/en/download/) node.js
- [Install](https://www.mongodb.org/downloads#production) and [initialize](https://docs.mongodb.org/manual/installation/#tutorials) mongoDb
- go to your console and change the directory to **trucktett/backend**
- install node modules (**npm install**)
- start the backend process (**node app**)
- fill database with dummy data with a http **POST** request to **trucktett/setup**

## Quickstart
- **localhost/webend**: Simple web implementation of the game
  - Login with User Data: (johannawhitney@imperium.com | password or maryanngillespie@zinca.com | password)
- **localhost/doc**: REST API documentation
  - You have to create the docs via `npm run docs`

## Tools
- [NodeJS](https://nodejs.org/en): Server runtime
  - [bodyparser](https://github.com/expressjs/body-parser): Parsing the request header and body
  - fs: Provides filesystem access for dummy data
  - [Express](http://expressjs.com/): Http server for rest api
  - [SocketIO](http://socket.io/): Websocket for chat and game
  - [Mongoose](http://mongoosejs.com/): MongoDB object modeling
  - [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken): User authentification
  - [morgan](https://github.com/expressjs/morgan): Loggin tool
- [MongoDB](https://www.mongodb.org/): Documentbased database