require('dotenv').config()
const btoa = require('btoa-lite');
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');


const { add, get, list } = require('./lib/github');
const { GITHUB_PATH = 'note' } = process.env;

const app = express();
app.use(bodyParser.json());
app.use(cors())
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));
app.use(express.static('static'))

app.post('/image', async (req, res) => {
  const { file } = req.files;
  await add(`image/${file.name}`, `Uploading ${file.name}`, file.data.toString('base64'));
})
app.get(`/${GITHUB_PATH}/:file`, async (req, res) => {
  const { file } = req.params;
  try {
    const content = await get(`${GITHUB_PATH}/${file}`)
    console.log({content});
    res.json({content});
  } catch (err) {
    console.log(err);
    res.json({content: ''});
  }
})
app.get('/list', async (req, res) => {
  try {
    const files = await list();
    res.send(files);
  } catch(err) {
    res.send(err);
  }
})
app.post(`/${GITHUB_PATH}/:file`, async (req, res) => {
  const { file } = req.params;
  const { content = '' } = req.body;
  try {
    await add(`${GITHUB_PATH}/${file}`, `upsert ${file}`, btoa(content));
    res.send('done');
  } catch(err) {
    res.send(err);
  }
})
app.listen(process.env.PORT || 7764)
