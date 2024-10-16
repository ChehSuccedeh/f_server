'use strict'

const {username, password} = require('../constants.js');

const child_process = require('child_process');

const creation = child_process.execSync('cat db_init.sql | sqlite3 users.db');

const db_interface = require('./db_interface');
db_interface.register(username, password, true)


