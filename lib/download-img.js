const http = require('http')
const https = require('https')
const Stream = require('stream').Transform

const download = (url) => {
  return new Promise((resolve, reject) => {
    let client = http
    if (url.indexOf('https') === 0) {
      client = https
    }
    client.get(url, (res) => {
      const data = new Stream()
      res.on('data', (chunk) => {
        data.push(chunk)
      })
      res.on('end', () => {
        resolve(data.read())
      })
      res.on('error', (err) => {
        reject(err)
      })
    })
  })

}
module.exports = {
  download,
}
