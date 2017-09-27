const lib = require('graphcool-lib')

module.exports = event => {
  const api = lib.fromEvent(event).api('simple/v1')

  return api.request(`query ($publicId: String!) {
    Session(publicId: $publicId) {
      data
      endpoint
    }
  }`, {publicId: event.data.id})
    .then(data => {
      return {
        data: {
          session: data.Session.data,
          endpoint: data.Session.endpoint,
        }
      }
    })
}