const request = require('supertest')
const {
  GITHUB_REPO,
  GITHUB_USER,
} = process.env

const github = require('../../lib/github')
if (GITHUB_USER) {
  const { list, get } = github(GITHUB_USER, GITHUB_REPO)

  describe('Github', () => {
    it('list', async () => {
      const files = await list('data')
      expect(files).toHaveProperty('data')
      const { data } = files
      const posts = await list(data[0].path)
      expect(posts).toHaveProperty('data')
      console.log(posts.data)
    })
    it('get', async () => {
      const content = await get('data/posts/001.json')
      expect(content).not.toBe(null)
      expect(JSON.parse(content)).toHaveProperty('date')
    })
  })

} else {
  describe('Github', () => {
    it('get', async () => {
      expect(null).toBe(null)
    })
  })
}
