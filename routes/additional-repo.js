const routes = require('express').Router()
const btoa = require('btoa-lite')
const {
  GITHUB_ADDITIONAL_REPO,
  GITHUB_USER,
} = process.env
// const BASE_PATH = '/data/posts' // decodeURIComponent(GITHUB_ADDITIONAL_REPO_PATH)
const github = require('../lib/github')
const { add, addImage, get, list } = github(GITHUB_USER, GITHUB_ADDITIONAL_REPO)

routes.get('/list', async (req, res) => {
  try {
    const files = await list('data/posts')
    res.send(files.data)
  } catch(err) {
    console.log({err})
    res.send(err)
  }
})

routes.get('/:folder/:file', async (req, res) => {
  const { file, folder } = req.params
  try {
    const content = await get(`data/${folder}/${file}.json`)
    res.json({data: content})
  } catch (err) {
    res.json({content: ''})
  }
})

routes.post('/:file', async (req, res) => {
  const { file, folder } = req.params
  const { content = '' } = req.body
  try {
    await add(`data/${folder}/${file}.json`, `upsert ${folder}/${file}`, btoa(content))
    res.send('done')
  } catch(err) {
    console.log(err)
    res.status(500)
  }
})

routes.get('/:file', async (req, res) => {
  const { file } = req.params
  try {
    const content = await get(`data/posts/${file}.json`)
    res.json({data: content})
  } catch (err) {
    res.json({content: ''})
  }
})

routes.post('/:file', async (req, res) => {
  const { file } = req.params
  const { content = '' } = req.body
  try {
    await add(`data/posts/${file}.json`, `upsert ${file}`, btoa(content))
    res.send('done')
  } catch(err) {
    console.log(err)
    res.status(500)
  }
})

routes.post('/upload/image', async (req, res) => {
  if (req.files) {
    const image = req.files['myImage']
    if (image) {
      const { path } = req.body
      const imagePath = `data/posts/${path}`
      await add(imagePath, 'Upload my image', image.data.toString('base64'))
      return res.send({path: imagePath})
    }
  }

  const { url, path } = req.body
  try {
    const data = await addImage(url, `data/posts/${path}`)
    res.send({ url: data })
  } catch (err) {
    res.status(500).send(err)
  }
})

module.exports = routes
