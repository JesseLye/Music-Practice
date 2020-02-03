# Music Practice
A Fullstack Web Application built using Sequelize, GraphQL, Express, Redis, Apollo, Angular and D3. 

## Live Demo
https://arcane-meadow-05248.herokuapp.com/#/signin

<!-- [START server] -->
### Installation - Server 
`Note: Sequelize CLI must be installed. `
1. Clone / Download the project
2. Cd into the "mp-server" directory 
3. Download the dependencies for mp-server using: `npm install`
4. Start a PostgreSQL server (see the PostgresSQL documentation for your respective operating system)
5. Create a database called: `music_practice`
```
Note: You're able to call the database whatever you want provided you update config.json located in mp-server/config.
You will likely need to update the user provided in config.json in order to connect to the database. 
```
6. Connect to the Postgres database via `psql` and add the uuid extension with the following command:
```
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```
7. Install and start Redis (see Redis's documentation for your respective operating system)
8. Within the mp-server directory, run the migrations using the command: `npx sequelize-cli db:migrate`
```
OPTIONAL: If you would like to use dummy data, run the command: npx sequelize-cli db:seed:all
```
9. Create a `.env` file within mp-server.
```
Note: By default, mp-server is configured to use gmail via nodemailer. You're able to customize the SMTP transport in mp-server/src/user/initResetPassword/resolvers.js
```
10. Create the following variables within the `.env` file like so:
```
GMAILUSER={EMAIL ADDRESS HERE}
GMAILPW={EMAIL PASSWORD HERE}
```
11. Run the server using `node app.js`
<!-- [END server] -->

<!-- [START client] -->
### Installation - Client 
1. Cd into the "mp-client" directory
2. Download the dependencies for mp-client using: `npm install`
```
Note: If you are running mp-server on a different addreess aside from localhost:8080 you will need to update the graphql.module.ts "uri" variable to point to your GraphQL server.
```
3. To build and serve the client, run the command: `ng serve`
4. By default, the application will be running at: `localhost:4200`
<!-- [END client] -->

<!-- [START features] -->
### Features
1. Login and Registration
2. Password retrieval
3. Metronome 
4. Data visualization
5. Account settings
6. Practice Songs/Exercises
7. Manage logged bpms
<!-- [END features] -->

<!-- [START acknowledgements] -->
### Acknowledgements
- Chris Wilson's Web Worker Metronome: https://github.com/cwilso/metronome
- Ben Awad's Fullstack Graphql Airbnb Project: https://github.com/benawad/fullstack-graphql-airbnb-clone
- Yan Holtz's D3 Gallery: https://www.d3-graph-gallery.com/
<!-- [END acknowledgements] -->
