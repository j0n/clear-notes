const request = require('supertest')
const {
  GITHUB_REPO,
  GITHUB_USER,
} = process.env

const github = require('../../lib/github')
const { list, get } = github(GITHUB_USER, GITHUB_REPO)


describe('Github', () => {
  it('list', async () => {
    const files = await list('data/posts')
    expect(files).toHaveProperty('data')
  })
  it('get', async () => {
    const content = await get('data/posts/001.json')
    console.log(content)
    expect(content).not.toBe(null)
    expect(JSON.parse(content)).toHaveProperty('date')
  })
})

