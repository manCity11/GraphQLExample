const express = require('express');
const bodyParser = require('body-parser');
const expressGraphQL = require('express-graphql');

const schema = require('./graphql/schema');

const app = express();

// Middlewares
//
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Import Routes
//
let routes = require('./routes');

app.get('/', routes.homeRoute.get);
app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}));

app.listen(5000);