const express = require('express');
const multer = require('multer');
const app = express();
const requests = require('./lib/Request');
const mime = require('mime-types');
const filename = require('./lib/filename');
require('dotenv').config();

const bunny = new requests(process.env.API_KEY);
app.use(multer().single('peace peace'));

app.put('/', async function (req, res) {
  const name = filename();
  await bunny.put('hitagi', null, `${name}.${mime.extension(req.file.mimetype)}`, req.file.buffer, req.file.mimetype);
  return res.end(`${process.env.DEV_SERVER}/${name}.${mime.extension(req.file.mimetype)}`);
});

app.get('/:Image', async (req, res) => {
  if (req.params.Image === 'favicon.ico') return res.sendStatus(200); 
  const picture = await bunny.get('hitagi', null, req.params.Image);
  res.writeHead(200, {
    'Content-Type': picture.mime,
  });
  return picture.stream.pipe(res);
});

app.listen(3000, () => console.log('listening on port 3000'));