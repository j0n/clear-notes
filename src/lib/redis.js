const { createClient } = require('redis')
const { REDIS_URL } = process.env

let client
;(async () => {
  client = createClient({
    url: REDIS_URL,
  })
  client.on('error', (err) => console.log('Redis Client Error', err))
  client.on('connect', () => {
    // console.log('on connect')
  })

  await client.connect()
})()

module.exports = client

//const value = await client.get("key");
