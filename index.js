// Manage users (id, name, password)
const express = require('express');
const helmet = require('helmet');
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
//  post api register
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
//   post api login
server.post('/api/login', (req, res) => {
    let { username, password } = req.body;
    const hash = bcrypt.hashSync(user.password, 10)
    Users.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          res.status(200).json({ message: `Welcome ${user.username}!` });
        } else {
          res.status(401).json({ message: 'Invalid Credentials' });
        }
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
