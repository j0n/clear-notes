const routes = require('express').Router()
const btoa = require('btoa-lite')
const {
  GITHUB_ADDITIONAL_REPO,
  GITHUB_ADDITIONAL_REPO_PATH = '/data',
  GITHUB_USER,
} = process.env
console.log({GITHUB_ADDITIONAL_REPO_PATH})
const github = require('../lib/github')
const { add, get, list } = github(GITHUB_USER, GITHUB_ADDITIONAL_REPO)

routes.get('/list', async (req, res) => {
  try {
    const files = await list(GITHUB_ADDITIONAL_REPO_PATH)
    res.send(files.data)
  } catch(err) {
    res.send(err)
  }
})

routes.get('/:file', async (req, res) => {
  const { file } = req.params
  try {
    const content = await get(`${GITHUB_ADDITIONAL_REPO_PATH}/${file}.json`)
    res.json({data: content})
  } catch (err) {
    res.json({content: ''})
  }
})

routes.post('/:file', async (req, res) => {
  const { file } = req.params
  const { content = '' } = req.body
  try {
    await add(`${GITHUB_ADDITIONAL_REPO_PATH}/${file}.json`, `upsert ${file}`, btoa(content))
    res.send('done')
  } catch(err) {
    console.log(err)
    res.status(500)
  }
})

module.exports = routes
