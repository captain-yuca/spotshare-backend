const conf = {}

const SECRET_KEY = process.env.SECRET_KEY || 'itsasecret'
const ENCODING = process.env.ENCODING || 'utf8'

conf.auth = {
  secret: Buffer.from(SECRET_KEY, ENCODING),
  tokenType: 'Token',
  algorithm: 'HS256',
  verifyOptions: { algorithms: [ 'HS256' ] }
}

conf.swagger = {
  info: {
    title: 'Spot Share API Documentation',
    version: '1.0.0'
  },
  cors: true,
  documentationPath: '/docs',
  grouping: 'tags',
  // May be used with auth
  // securityDefinitions: {
  //   'jwt': {
  //     'type': 'apiKey',
  //     'name': 'Authorization',
  //     'in': 'header'
  //   }
  // },
  sortEndpoints: 'path',
  jsonEditor: true,
  tags: [
    {
      name: 'postcards',
      description: 'PostCards endpoint'
    }
  ]
}

module.exports = conf
