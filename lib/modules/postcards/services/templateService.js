const Schmervice = require('schmervice')
const {
  // ValidationError,
  NotFoundError
} = require('objection')

const {
  DBError
  // ConstraintViolationError,
  // UniqueViolationError,
  // NotNullViolationError,
  // ForeignKeyViolationError,
  // CheckViolationError,
  // DataError
} = require('objection-db-errors')
class TemplateService extends Schmervice.Service {
  async getDefaultTemplate () {
    const { templateRepository } = this.server.services()
    let deafultTemplateId = 1
    let template
    try {
      template = await templateRepository.findById(deafultTemplateId)
    } catch (err) {
      throw err
    }
    return template
  }

  async getSpotTemplate (spotId) {
    const { templateRepository } = this.server.services()
    let template
    try {
      template = await templateRepository.findBySpotId(spotId)
    } catch (err) {
      if (err instanceof NotFoundError) {
        template = await this.getDefaultTemplate()
      } else {
        throw new DBError('Some error occurred')
      }
    }
    return template
  }
}
module.exports = TemplateService
