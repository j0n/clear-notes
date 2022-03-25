const jwt = require('jsonwebtoken')
const { TOKEN_SECRET } = process.env

const sign = (email) => {
  const token = jwt.sign({ email }, TOKEN_SECRET, { expiresIn: 60 * 60 * 1000 })
  return token
}
const verify = (token, email) => {
  const decoded = jwt.verify(token, TOKEN_SECRET)
  if (typeof decoded.email === 'undefined') {
    return false
  }
  return decoded.email === email
}
const isAuthorized = (req, res, next) => {
  const { authorization = false } = req.headers
  if (!authorization) {
    return res.status(401).json({
      error: 'None valid user',
    })
  }
  const token = authorization.split(' ')[1]
  if (token.length < 3) {
    res.status(401).json({
      error: 'None valid user',
    })
  }

  const { EMAIL } = process.env
  try {
    if (verify(token, EMAIL)) {
      return next()
    }
  } catch (err) {
    console.error(err)
  }
  res.status(401).json({
    error: 'None valid user',
  })
}
module.exports = {
  sign,
  verify,
  isAuthorized,
}
