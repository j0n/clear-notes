const request = require('supertest')
const { app, server } = require('../index')

afterAll(() => {
  server.close()
})
describe('Post Endpoints', () => {
  it('should NOT login', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        password: 'lol',
        email: 'lol@lol.com',
      })
    expect(res.statusCode).toEqual(401)
  })
  it('should login', async () => {
    const { EMAIL, PASSWORD } = process.env
    const res = await request(app)
      .post('/auth/login')
      .send({
        password: PASSWORD,
        email: EMAIL
      })
    expect(res.body.token).not.toBe(undefined)
    expect(res.statusCode).toEqual(200)
  })
})
