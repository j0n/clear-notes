require('dotenv').config()
const btoa = require('btoa-lite');
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');


const { add, get } = require('./lib/github');
const app = express();
app.use(bodyParser.json());
app.use(cors())
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));
app.post('/image', async (req, res) => {
  const { file } = req.files;
  await add(`tmp/${file.name}`, `Uploading ${file.name}`, file.data.toString('base64'));
})
app.get('/note/:file', async (req, res) => {
  const { file } = req.params;
  try {
    const content = await get(`note/${file}`)
    console.log({content});
    res.json({content});
  } catch (err) {
    console.log(err);
    res.json({content: ''});
  }
})
app.post('/note/:file', async (req, res) => {
  const { file } = req.params;
  const { content = '' } = req.body;
  try {
    await add(`note/${file}`, `upsert ${file}`, btoa(content));
    res.send('done');
  } catch(err) {
    res.send(err);
  }
})
app.listen(process.env.PORT || 7764)
// add();
