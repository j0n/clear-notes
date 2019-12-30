const routes = require('express').Router();
const btoa = require('btoa-lite');
const { add, get, list } = require('../lib/github')('j0n', 'hearsay.se');

routes.get('/list', async (req, res) => {
  try {
    const files = await list(`/data`);
    res.send(files.data);
  } catch(err) {
    res.send(err);
  }
})

routes.get(`/:file`, async (req, res) => {
  const { file } = req.params;
  try {
    const content = await get(`data/${file}.json`)
    res.json({data: content});
  } catch (err) {
    res.json({content: ''});
  }
})

routes.post(`/:file`, async (req, res) => {
  const { file } = req.params;
  const { content = '', sha = false } = req.body;
  try {
    await add(`data/${file}.json`, `upsert ${file}`, btoa(content));
    res.send('done');
  } catch(err) {
    console.log(err);
    res.status(500);
  }
})

module.exports = routes;
