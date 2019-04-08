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
 server.get('/', (req, res) => {
    res.send("It's alive!");
  });

  server.post('/api/register', (req, res) => {
    let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10)
  user.password = hash
    Users.add(user)
      .then(saved => {
        res.status(201).json(saved);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });
// 
const port = process.env.PORT || 2500;
server.listen(port, () =>
  console.log(`\n** API running on http://localhost:${port} **\n`)
);
