module.exports = (server) => {
  return {
    /**
     * GET /api/postcards
     */
    getPostcards (request, h) {
      let postcards = [
        {
          id: 10,
          title: 'Tiki House',
          imgUrl: 'https://via.placeholder.com/300.png/09f/fff',
          date: 'May 25, 2018'
        },
        {
          id: 13,
          title: 'Tramboliko',
          imgUrl: 'https://via.placeholder.com/300.png/09f/fff',
          date: 'January 13, 2019'
        }
      ]
      let response = {
        postcards,
        count: 2
      }
      // console.log(response)
      return h.response(response).code(200)
    }
  }
}
