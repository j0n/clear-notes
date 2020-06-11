require('dotenv').config()
const btoa = require('btoa-lite')
const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser')

const additionalRepo = require('./routes/additional-repo')
const betlehem = require('./routes/betlehem-repo')
const { sign, isAuthorized } = require('./lib/auth')
const github = require('./lib/github')

const { GITHUB_PATH = 'note', GITHUB_REPO, GITHUB_USER } = process.env
const { add, get, list } = github(GITHUB_USER, GITHUB_REPO)

const app = express()
app.use(bodyParser.json())
app.use(cors())
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}))
app.use(express.static('static'))
app.use(['/login', '/n/*'], express.static('static'))
app.use('/h', express.static(__dirname + '/h'))

app.post('/image', isAuthorized, async (req, res) => {
  const { file } = req.files
  await add(`image/${file.name}`, `Uploading ${file.name}`, file.data.toString('base64'))
  res.send('ok')
})

app.get(`/${GITHUB_PATH}/list`, isAuthorized, async (req, res) => {
  try {
    const files = await list(`/${GITHUB_PATH}`)
    res.send(files.data)
  } catch(err) {
    res.send(err)
  }
})
app.get(`/${GITHUB_PATH}/:file`, isAuthorized, async (req, res) => {
  const { file } = req.params
  try {
    const content = await get(`${GITHUB_PATH}/${file}`)
    res.json({content})
  } catch (err) {
    res.json({content: ''})
  }
})

app.post('/auth/login', (req, res) => {
  const { password = '', email = '' } = req.body
  if (password === process.env.PASSWORD && email === process.env.EMAIL) {
    return res.json({ token: sign(email) })
  }
  res.status(401).json({
    error: 'Wrong credentials',
  })
})
app.post(`/${GITHUB_PATH}/:file`, isAuthorized, async (req, res) => {
  const { file } = req.params
  const { content = '' } = req.body
  const fileName = file.replace(/[\W_]+/g,' ')
  try {
    await add(`${GITHUB_PATH}/${fileName}`, `upsert ${fileName}`, btoa(content))
    res.send('done')
  } catch(err) {
    res.send(err)
  }
})


app.use('/hearsay', isAuthorized, additionalRepo)
app.use('/bethlem', betlehem)
const server = app.listen(process.env.PORT || 7764)

module.exports = {
  app,
  server,
}
