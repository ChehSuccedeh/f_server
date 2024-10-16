'use strict';

const DB = require('./db');
const crypto = require('crypto');


//------------------ Login API ------------------
exports.login = (username, password) => {
    const login_failed = 'Incorrect username or password';
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM users WHERE username = ?';
        DB.get(query, [username], (err, row) => {
            if (err) {
                reject(err);
            }
            if (row === undefined) {
                reject(res.status(200).json({ message: "Logged out" }));
            } else {
                const user = {
                    username: row.username,
                    isAdmin: row.admin === 1 ? true : false,
                }
                crypto.scrypt(password, row.salt, 64, function (err, hash) {
                    if (err) {
                        reject(err);
                    }
                    if (!crypto.timingSafeEqual(Buffer.from(hash, 'hex'), hash)) {
                        reject(login_failed);
                    } else {
                        resolve(user);
                    }
                });
            }
        });
    });
}
//------------------ User Info API ------------------
exports.getUser = (username) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM users WHERE username = ?';
        DB.get(query, [username], (err, row) => {
            if (err) {
                reject(err);
            }
            if (row === undefined) {
                reject('User not found');
            } else {
                const user = {
                    username: row.username,
                    isAdmin: row.admin === 1 ? true : false,
                }
                resolve(user);
            }
        });
    });
}

//------------------ Register API ------------------
exports.register = (username, password, isAdmin = false) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM users WHERE username = ?';
        DB.get(query, [username], (err, row) => {
            if (err) {
                reject(err);
            }
            if (row !== undefined) {
                reject('User already exists');
            } else {
                const salt = crypto.randomBytes(64, function (err, buffer) {
                    if (err) {
                        reject(err);
                    }
                    crypto.scrypt(password, buffer.toString('hex'), 256, function (hash_err, hash) {
                        if (hash_err) {
                            reject(hash_err);
                        }
                        // console.log(hash.toString('hex').length, buffer.toString('hex').length);
                        const query = 'INSERT INTO users (username, hash, salt, admin) VALUES (?, ?, ?, ?)';
                        DB.run(query, [username, hash.toString('hex'), buffer.toString('hex'), isAdmin], (query_err) => {
                            if (err) {
                                reject(query_err);
                            }
                            const user = { username: username, isAdmin: false };
                            resolve(user);
                        });
                    });
                });
            }
        });
    });
}