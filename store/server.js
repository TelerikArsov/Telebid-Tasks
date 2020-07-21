require('dotenv').config();
const express = require('express');
const app = express();
const port = 5000;

const { Client } = require('pg');

const client = new Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});

client.connect();


app.listen(port, () => console.log(`Server started on port: ${port}`));

