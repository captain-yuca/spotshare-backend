const Postcard = require('../../lib/modules/postcards/models/Postcard')
var faker = require('faker')

module.exports = async (factory) => {
  factory.define('postcard_without_assoc', Postcard, () => ({
    imgUrl: 'https://ak5.picdn.net/shutterstock/videos/3683705/thumb/1.jpg',
    title: faker.hacker.noun(),
    message: faker.lorem.paragraph(6),
    spotId: faker.random.number(10),
    latitude: faker.random.number(-100000, 100000, 6),
    longitude: faker.random.number(-100000, 100000, 6),
    style: 'samplestyle',
    date: faker.date.recent(faker.random.number(0, 5)).toISOString()
    // id: factory.seq('postcard.id', (n) => n)
  }))
  factory.define('postcard', Postcard, () => ({
    imgUrl: 'https://ak5.picdn.net/shutterstock/videos/3683705/thumb/1.jpg',
    title: faker.hacker.noun(),
    message: faker.lorem.paragraph(6),
    spotId: faker.random.number(10),
    latitude: faker.random.number(-100000, 100000, 6),
    longitude: faker.random.number(-100000, 100000, 6),
    style: 'samplestyle',
    date: faker.date.recent(faker.random.number(0, 5)).toISOString(),
    // id: factory.seq('postcard.id', (n) => n),
    owner: factory.assoc('user')
  }))
}
