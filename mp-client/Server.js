
// Heroku vomit
const express = require('express');
const app = express();
app.use(express.static(__dirname + '/dist/mp-client'));
app.listen(process.env.PORT || 8080);
