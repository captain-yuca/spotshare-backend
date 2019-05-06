const Schmervice = require('schmervice')
const faker = require('faker')
const axios = require('axios')

const {
  NotFoundError
} = require('objection')
class SpotRepository extends Schmervice.Service {
  async findById (id) {
    if (process.env.NODE_ENV === 'test') {
      if (id.charAt(0) !== '-') {
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
    } else {
      let spot
      const url = `https://graph.facebook.com/v3.2/${id}?access_token=597239724107376|VtePkoRsic3Xmtg935xmqUtAnLc&fields=name,picture,photos,description,location`
      const res = await axios
        .get(url)
      const payload = res.data
      if (payload.error) {
        throw new NotFoundError('The given spot id does not exist!')
      }
      let photoUrl
      if (payload.photos) {
        let photoPayload = await axios
          .get(`https://graph.facebook.com/v3.2/${id}/photos?access_token=597239724107376|VtePkoRsic3Xmtg935xmqUtAnLc&fields=name,picture,photos,description,location`)

        photoPayload = photoPayload.data
        photoUrl = photoPayload.data[0].picture
      } else {
        photoUrl = payload.picture.data.url
      }

      spot = {
        id,
        name: payload.name,
        photoUrl,
        latitude: payload.location.latitude,
        longitude: payload.location.longitude
      }
      return spot
    }
  }
}

module.exports = SpotRepository
