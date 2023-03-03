const routes = require('express').Router()
const btoa = require('btoa-lite')
const redis = require('../lib/redis')

const { GITHUB_ADDITIONAL_REPO, GITHUB_USER } = process.env
// const BASE_PATH = '/data/posts' // decodeURIComponent(GITHUB_ADDITIONAL_REPO_PATH)
const github = require('../lib/github')
const { add, addImage, get, list } = github(GITHUB_USER, GITHUB_ADDITIONAL_REPO)
let fetching = false
let batchUpdate = []

const fetchAll = async () => {
  fetching = true
  const files = await list('data/posts')
  const allData = []
  for (const file in files.data) {
    const { path, type } = files.data[file]
    if (type !== 'file') {
      continue
    }
    try {
      console.log(`loading ${path}`)
      const content = await get(path)
      allData.push({ data: JSON.parse(content) })
    } catch (err) {
      console.log('failed fetching content', err)
    }
  }

  console.log('All Data loaded')
  await redis.set('all', JSON.stringify(allData))
  fetching = false
  if (batchUpdate.length > 0) {
    for (let item of batchUpdate) {
      const { id, path } = item
      await updateItemInCache(id, path)
    }
    batchUpdate = []
  }
}
const updateItemInCache = async (id, path) => {
  if (fetching) {
    batchUpdate.push({ id, path })
  }
  const content = await get(path)
  const data = await redis.get('all')
  const cache = JSON.parse(data)
  console.log('update item', id, content)
  const index = cache.findIndex((item) => item.data.id === id)
  if (index !== -1) {
    cache[index] = { data: JSON.parse(content) }
  } else {
    cache.push({ data: JSON.parse(content) })
  }
  await redis.set('all', JSON.stringify(cache))
}

const start = async () => {
  const existing = await redis.get('all')
  if (!existing) {
    fetchAll()
  }
}
if (!process.env.IS_TEST) {
  start()
}

routes.get('/list', async (req, res) => {
  try {
    const files = await list('data/posts')
    res.send(files.data)
  } catch (err) {
    console.log({ err })
    res.send(err)
  }
})

routes.get('/getAll', async (req, res) => {
  try {
    const {
      query: { force },
    } = req
    if (force) {
      await fetchAll()
    }
    const all = await redis.get('all')
    res.json(JSON.parse(all))
  } catch (err) {
    console.log({ err })
    res.send('err')
  }
})

routes.get('/playlists/:file', async (req, res) => {
  const { file } = req.params
  try {
    const content = await get(`playlists/${file}.json`)
    res.json(content)
  } catch (err) {
    res.json({ content: '' })
  }
})

routes.post('/playlists/:file', async (req, res) => {
  const { file } = req.params
  const content = JSON.stringify(req.body || [], null, 2)
  try {
    await add(
      `playlists/${file}.json`,
      `upsert playlists/${file}`,
      btoa(content),
    )
    res.send('done')
  } catch (err) {
    console.log(err)
    res.status(500)
  }
})

routes.get('/:file', async (req, res) => {
  const { file } = req.params
  try {
    const content = await get(`data/posts/${file}.json`)
    res.json({ data: content })
  } catch (err) {
    res.json({ content: '' })
  }
})

routes.post('/:file', async (req, res) => {
  const { file } = req.params
  const { content = '' } = req.body
  try {
    console.log('UPDATE', file)
    const path = `data/posts/${file}.json`
    await add(path, `upsert ${file}`, btoa(content))
    await updateItemInCache(file, path)
    res.json({ data: content })
  } catch (err) {
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
      return res.send({ path: imagePath })
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
