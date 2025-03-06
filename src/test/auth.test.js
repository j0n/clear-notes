/* global describe, it, expect */
const { sign, verify } = require('../lib/auth')
const email = 'email@example.com'
let token = ''

describe('AUTH', () => {
  it('should create a new token', () => {
    token = sign(email)
    expect(token).not.toBe('')
  })
  it('should be verified token', () => {
    const isVerified = verify(token, email)
    expect(isVerified).toEqual(true)
  })
})

