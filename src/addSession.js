const lib = require('graphcool-lib')
const Hashids = require('hashids')

module.exports = event => {
  const api = lib.fromEvent(event).api('simple/v1')

  return api.request(`{
    _allSessionsMeta {
      count
    }
  }`)
    .then(data => {
      const count = parseInt(data._allSessionsMeta.count, 10)
      const hashids = new Hashids()
      const publicId = hashids.encode(count, Math.round(Math.random() * 10))

      return api.request(`mutation ($publicId: String! $data: String! $endpoint: String!) {
        createSession(publicId: $publicId, data: $data, endpoint: $endpoint) {
          id
        }
      }`, {publicId, data: event.data.session, endpoint: event.data.endpoint})
      .then(result => {
        return {
          data: {
            id: publicId,
            session: event.data.session,
            endpoint: event.data.endpoint,
          }
        }
      })
    })
}