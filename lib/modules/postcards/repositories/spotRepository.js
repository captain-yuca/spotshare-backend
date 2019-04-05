const Schmervice = require('schmervice')
const faker = require('faker')
const {
  NotFoundError
} = require('objection')
class SpotRepository extends Schmervice.Service {
  async findById (id) {
    if (id > 0) {
      let spot = {
        id: id,
        name: faker.random.words(2),
        photoUrl: faker.image.nightlife(),
        latitude: faker.random.number(-90, 90, 8),
        longitude: faker.random.number(-180, 180, 8)

      }
      return spot
    } else {
      throw new NotFoundError('The given spot id does not exist!')
    }
  }
}

module.exports = SpotRepository
