require('dotenv').config()
const btoa = require('btoa-lite');
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const hearsayAdmin = require('./routes/hearsay-admin');
const { sign, isAuthorized } = require('./lib/auth');


const { add, get, list } = require('./lib/github')('j0n', 'notes');
const { GITHUB_PATH = 'note' } = process.env;

const app = express();
app.use(bodyParser.json());
app.use(cors())
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));
app.use(express.static('static'))
app.use(['/login', '/n/*'], express.static('static'))
app.use('/h', express.static(__dirname + '/h'))

app.post('/image', isAuthorized, async (req, res) => {
  const { file } = req.files;
  await add(`image/${file.name}`, `Uploading ${file.name}`, file.data.toString('base64'));
})

app.get(`/${GITHUB_PATH}/list`, isAuthorized, async (req, res) => {
  try {
    const files = await list(`/${GITHUB_PATH}`);
    res.send(files.data);
  } catch(err) {
    res.send(err);
  }
})
app.get(`/${GITHUB_PATH}/:file`, isAuthorized, async (req, res) => {
  const { file } = req.params;
  try {
    const content = await get(`${GITHUB_PATH}/${file}`)
    res.json({content});
  } catch (err) {
    res.json({content: ''});
  }
})

app.post(`/auth/login`, (req, res) => {
  const { password = '', email = '' } = req.body;
  if (password === process.env.PASSWORD && email === process.env.EMAIL) {
    return res.json({ token: sign(email) });
  }
  res.status(401).json({
    error: 'Wrong credentials'
  });
});
app.post(`/${GITHUB_PATH}/:file`, isAuthorized, async (req, res) => {
  const { file } = req.params;
  const { content = '' } = req.body;
  try {
    await add(`${GITHUB_PATH}/${file}`, `upsert ${file}`, btoa(content));
    res.send('done');
  } catch(err) {
    res.send(err);
  }
});


app.use('/hearsay', hearsayAdmin);
app.listen(process.env.PORT || 7764)
