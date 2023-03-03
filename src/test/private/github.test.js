const request = require('supertest')
const btoa = require('btoa-lite')
const {
  GITHUB_REPO,
  GITHUB_USER,
} = process.env

const github = require('../../lib/github')
if (GITHUB_USER) {
  const { list, get, add } = github(GITHUB_USER, GITHUB_REPO)

  describe('Github', () => {
    it('list', async () => {
      const files = await list('data/posts')
      expect(files).toHaveProperty('data')
      const { data } = files
      const posts = await list(data[0].path)
      expect(posts).toHaveProperty('data')
    })
    it('get', async () => {
      const content = await get('data/posts/001.json')
      expect(content).not.toBe(null)
      expect(JSON.parse(content)).toHaveProperty('date')
    })
    it('update', async () => {
      const content = '{\"content\":\"\",\"title\":\"Hello\",\"published\":false,\"slug\":\"036-teest\",\"key\":\"036-teest\",\"id\":\"036-teest\"}'
      try {
        const response = await add('data/posts/036-teest.json', 'Test update', btoa(content))
        expect(response).not.toBe(null)
      } catch (err) {
        expect(err).toBe(null)
      }

    })

  })

} else {
  describe('Github', () => {
    it('get', async () => {
      expect(null).toBe(null)
    })
  })
}
