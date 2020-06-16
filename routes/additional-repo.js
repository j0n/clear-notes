const routes = require('express').Router()
const btoa = require('btoa-lite')
const {
  GITHUB_ADDITIONAL_REPO,
  GITHUB_USER,
} = process.env
// const BASE_PATH = '/data/posts' // decodeURIComponent(GITHUB_ADDITIONAL_REPO_PATH)
const github = require('../lib/github')
const { add, get, list } = github(GITHUB_USER, GITHUB_ADDITIONAL_REPO)

routes.get('/list', async (req, res) => {
  try {
    const files = await list('data/posts')
    res.send(files.data)
  } catch(err) {
    console.log({err})
    res.send(err)
  }
})

routes.get('/:file', async (req, res) => {
  const { file } = req.params
  try {
    const content = await get(`data/posts/${file}.json`)
    res.json({data: content})
  } catch (err) {
    console.log({err})
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
    console.log({err})
    console.log(err)
    res.status(500)
  }
})

module.exports = routes
