const conf = {}

const SECRET_KEY = process.env.SECRET_KEY || 'itsasecret'
const ENCODING = process.env.ENCODING || 'utf8'

conf.auth = {
  secret: Buffer.from(SECRET_KEY, ENCODING),
  tokenType: 'Token',
  algorithm: 'HS256',
  verifyOptions: { algorithms: [ 'HS256' ] }
}

conf.pagination = {
  query: {
    page: {
      name: 'page', // The page parameter will now be called the_page
      default: 1
    },
    limit: {
      name: 'limit', // The limit will now be called per_page
      default: 10 // The default value will be 10
    }
  },
  meta: {
    location: 'body', // The metadata will be put in the response body
    name: '_links', // The meta object will be called metadata
    count: {
      active: false,
      name: 'count'
    },
    totalCount: {
      active: false
    },
    pageCount: {
      name: 'pageCount',
      active: false
    },
    self: {
      active: true // Will not generate the self link
    },
    first: {
      active: true // Will not generate the first link
    },
    last: {
      active: true // Will not generate the last link
    }
  },
  routes: {
    include: ['/api/postcards']
  }
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
