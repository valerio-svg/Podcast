'use strict';

const db = require('./db.js');
const bcrypt = require('bcrypt');

const createUser = function (row) {
  return ({
    username: row.username,
    email: row.email,
    creator: row.creator,
    user_id: row.user_id
  });
}

exports.createUser = function(user) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO User(username, email, password, creator) VALUES (?, ?, ?, ?)';
    // create the hash as an async call, given that the operation may be CPU-intensive (and we don't want to block the server)
    bcrypt.hash(user.password, 10).then((hash => {
      db.run(sql, [user.username, user.email, hash, user.creator], function(err) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    }));
  });
}

exports.getUserByEmail = function (email) {
  return new Promise((resolve, reject) => {
      const sql = 'SELECT user_id, email, creator FROM User WHERE email = ?';
      db.get(sql, [email], (err, row) => {
          if (err)
              reject(err);
          else if (row === undefined)
              resolve({ error: 'User not found.' });
          else {
              const user = row;
              resolve({ user });
          }
      });
  });
};

// fa la stessa cosa per user ma per id
// serializzazione della sessione
exports.getUserById = function(user_id) {
  return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM User WHERE user_id = ?';
      db.get(sql, [user_id], (err, row) => {
          if (err) 
            reject(err);
          else if (row === undefined)
            resolve({error: 'User not found.'});
          else {
            const user = createUser(row);
            resolve(user);
          }
      });
  });
};

exports.getUserByUsername = function(username) {
  return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM User WHERE username = ?';
      db.get(sql, [username], (err, row) => {
          if (err) 
            reject(err);
          else if (row === undefined)
            resolve({error: 'User not found.'});
          else {
            const user = createUser(row);
            resolve(user);
          }
      });
  });
};

exports.getUser = function(email, password) {
  return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM User WHERE email = ?';
      db.get(sql, [email], (err, row) => {
          if (err) 
            reject(err);
          else if (row === undefined)
            resolve({error: 'User not found.'});
          else {
            const user = {user_id: row.user_id, username: row.username};
            let check = false;
            
            // controllo se password e hash della password se sono uguali
            if(bcrypt.compareSync(password, row.password))
              check = true;

            resolve({user, check});
          }
      });
  });
};