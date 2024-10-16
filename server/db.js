'use strict';

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const { execSync } = require('child_process');

const path = './users.db';

if (!fs.existsSync(path)) {
    console.error('users.db file not found. Creating DB using db_creation.js');
    try {
        const output = execSync('node ./db_creation.js');
        console.log(`db_creation.js: ${output.toString()}`);
    } catch (err) {
        console.error(`Error executing script: ${err.message}`);
        throw err;
    }
}

const db = new sqlite3.Database(path, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the database.');
    }
});

module.exports = db;