// config.js
const pool = require('./pool'); // Import the PostgreSQL pool from pool.js

const State = {
  db: null,
};

const getcon = (cb) => {
  if (State.db) {
    cb();
  } else {
    pool.connect((err, client, done) => {
      if (err) {
        cb(err);
      } else {
        State.db = client;
        State.done = done;
        cb();
      }
    });
  }
};

const getDb = () => {
  return State.db;
};

module.exports = { getcon, getDb };
