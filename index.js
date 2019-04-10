// Manage users (id, name, password)
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcrypt')
const session = require('express-session')
const knexSessionStore = require('connect-session-knex')(session)


// const knexConfig = require('./knexfile').development;
// const db = knex(knexConfig);

const db = require('./database/dbConfig.js');
const Users = require('./users/users-model');
const authRouter = require('./auth/auth-router');

const server = express();
server.use(helmet());
server.use(express.json());
server.use(cors());
const sessionConfig = {
  name: 'monkey doo',
  secret: 'we like banana',
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false,
  },
  httpOnly: true,
  resave: false,
  saveUninitialized: false,
  // storing in the data base
  store: new knexSessionStore({
    knex: require('./database/dbConfig'),
    tablename: 'sessions',
    sidfieldname: 'sid',
    createtable: true,
    clearInterval: 1000 * 60 * 60
  })
}

server.use(session(sessionConfig));
server.use('/api/auth', authRouter);

//
server.get('/', (req, res) => {
  res.send("It's alive!");
});

// restricted middleware
function restricted(req, res, next) {
  let { username, password } = req.headers;
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ message: 'Not allowed' })
  }
}

//  post api register Users
server.post('/api/register', restricted, (req, res) => {
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
server.post('/api/login', restricted, (req, res) => {
  let { username, password } = req.body;
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

//    api users

server.get('/api/users', restricted, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

// 
const port = process.env.PORT || 2500;
server.listen(port, () =>
  console.log(`\n** API running on http://localhost:${port} **\n`)
);
