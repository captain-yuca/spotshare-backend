const Schmervice = require('schmervice')
const {
  NotFoundError
} = require('objection')
class SpotRepository extends Schmervice.Service {
  async findById (id) {
    if (id > 0) {
      let spot = {
        id: id,
        name: "This Spot's name",
        photoUrl: 'https://jooinn.com/images/puerto-rico-2.jpg',
        latitude: 18.204361,
        longitude: -67.139797

      }
      return spot
    } else {
      throw new NotFoundError('The given spot id does not exist!')
    }
  }
}

module.exports = SpotRepository
