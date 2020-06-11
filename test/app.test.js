const request = require('supertest')
const { app, server } = require('../index')

afterAll(() => {
  server.close()
})
describe('Post Endpoints', () => {
  it('should create a new post', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        password: 'lol',
        email: 'lol@lol.com',
      })
    expect(res.statusCode).toEqual(401)
  })
})
