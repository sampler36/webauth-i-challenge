// Manage cohorts (id, name)
const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const cors = require('cors');
const bcrypt = require('bcrypt')

// const knexConfig = require('./knexfile').development;
// const db = knex(knexConfig);

const db = require('./database/dbConfig.js');
const Users = require('./users/users-model');

const server = express();
server.use(helmet());
server.use(express.json());
server.use(cors());
 //


// 
const port = process.env.PORT || 2500;
server.listen(port, () =>
  console.log(`\n** API running on http://localhost:${port} **\n`)
);
