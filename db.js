'use strict';

const sqlite = require('sqlite3');

const db = new sqlite.Database('podcast.db', (err) => {
  if (err) {
    console.err(err.message);
    throw err;
  }
});

module.exports = db;