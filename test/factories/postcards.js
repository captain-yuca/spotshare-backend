const Postcard = require('../../lib/modules/postcards/models/Postcard')
const Tag = require('../../lib/modules/postcards/models/Tag')
var faker = require('faker')

module.exports = async (factory) => {
  factory.define('public_tag', Tag, {
    isPublicTag: true

  })
  factory.define('category_tag', Tag, {
    isPublicTag: false,
    text: () => faker.random.word()
  })
  factory.define('sharing_tag', Tag, {
    isPublicTag: false

  })
  factory.define('postcard_without_assoc', Postcard, ({
    imgUrl: 'https://ak5.picdn.net/shutterstock/videos/3683705/thumb/1.jpg',
    title: () => faker.random.word(),
    message: () => faker.lorem.paragraph(6),
    spotId: () => faker.random.number(10).toString(),
    latitude: () => faker.random.number(-100000, 100000, 6),
    longitude: () => faker.random.number(-100000, 100000, 6),
    style: { test: 'samplestyle' },
    date: () => faker.date.recent(faker.random.number(0, 5)).toISOString()
    // id: factory.seq('postcard.id', (n) => n)
  }))
  factory.define('postcard', Postcard, ({
    imgUrl: 'https://ak5.picdn.net/shutterstock/videos/3683705/thumb/1.jpg',
    title: () => faker.random.word(),
    message: () => faker.lorem.paragraph(6),
    spotId: () => faker.random.number(10).toString(),
    latitude: () => faker.random.number(-100000, 100000, 6),
    longitude: () => faker.random.number(-100000, 100000, 6),
    style: { test: 'samplestyle' },
    date: () => faker.date.recent(faker.random.number(0, 5)).toISOString(),
    // id: factory.seq('postcard.id', (n) => n),
    owner: () => factory.assoc('user')
  }))
  factory.define('postcard_with_public_tag', Postcard, {
    imgUrl: 'https://ak5.picdn.net/shutterstock/videos/3683705/thumb/1.jpg',
    title: () => faker.random.word(),
    message: () => faker.lorem.paragraph(6),
    spotId: () => faker.random.number(10).toString(),
    latitude: () => faker.random.number(-100000, 100000, 6),
    longitude: () => faker.random.number(-100000, 100000, 6),
    style: { test: 'samplestyle' },
    date: () => faker.date.recent(faker.random.number(0, 5)).toISOString(),
    tags: factory.assocMany('public_tag', 2)
  })
}
