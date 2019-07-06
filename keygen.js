const args = require('yargs').argv;
const jwt = require('jsonwebtoken');
require('dotenv').config();

if (!args.user) return console.log('No username found! "--user NAME"');
const token = jwt.sign({ username: args.user }, process.env.SECRET, { expiresIn: args.expire ? args.expire : '183d' });
if (!token) return console.log('something broke');
return console.log(token);