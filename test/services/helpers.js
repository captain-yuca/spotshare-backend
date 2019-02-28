
function extractMethod (methodName, service) {
  let o = service
    .find(o => o.name === methodName)
  return o.method
}

module.exports = {
  extractMethod
}
