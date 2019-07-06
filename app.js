const express = require('express');
const multer = require('multer');
const app = express();
const requests = require('./lib/Request');
const mime = require('mime-types');
const filename = require('./lib/filename');
const jwte = require('express-jwt');
require('dotenv').config();

const bunny = new requests(process.env.API_KEY);
app.use(multer().single('peace peace'));

app.use(jwte({
  secret: process.env.SECRET,
  getToken: req => req.headers['authorization'],
}).unless({url: /\/.*/, method: 'GET'}));

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') return res.sendStatus(403);
  return next();
});

app.put('/', async (req, res) => {
  console.log(req.headers['authorization']);
  if (!req.file) return res.sendStatus(500);
  const name = filename();
  await bunny.put(process.env.STORAGE, null, `${name}.${mime.extension(req.file.mimetype)}`, req.file.buffer, req.file.mimetype);
  return res.end(`${process.env.PROD_SERVER}/${name}.${mime.extension(req.file.mimetype)}`);
});

app.get('/:Image', async (req, res) => {
  if (req.params.Image === 'favicon.ico') return res.sendStatus(200); 
  const picture = await bunny.get(process.env.STORAGE, null, req.params.Image);
  res.writeHead(200, {
    'Content-Type': picture.mime,
  });
  return picture.stream.pipe(res);
});

app.listen(3000, () => console.log('listening on port 3000'));