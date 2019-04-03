const Schmervice = require('schmervice')
const {
  NotFoundError
} = require('objection')
class TemplateRepository extends Schmervice.Service {
  async findById (id) {
    if (id > 0) {
      let template = {
        style: {
          title: {
            'font-size': '30px',
            'font-family': 'Verdana'
          },
          content: {
            'background-color': 'rgb(97, 177, 254)',
            'font-family': 'Verdana',
            'font-size': '15px'
          }
        }

      }
      return template
    } else {
      throw new NotFoundError('The given template id does not exist!')
    }
  }
  async findBySpotId (spotId) {
    throw new NotFoundError('The given spot does not have a template')
  }
}

module.exports = TemplateRepository
