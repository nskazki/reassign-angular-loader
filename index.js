'use strict'

let _uniqueId = 0
const uniqueId = () => ++_uniqueId

module.exports = function reassignAngularLoader(source) {
  this.cacheable()
  const origPropName = `__originalAngular${uniqueId()}`

  const needDefineAngular = !/(var|let|const)\s+angular\s*=\s*require\(['"]angular["']\)/.test(source)
  const angularDefineStr = needDefineAngular
    ? 'var angular = require("angular");'
    : '/* ANGULAR ALREADY DEFINED AS LOCAL VARIABLE */'

  return `
/* REASSIGN ANGULAR LOADER -- https://github.com/nskazki/reassign-angular-loader */

var ${origPropName} = window.angular;
delete window.angular;
window.angular = require('angular');
${angularDefineStr}

${source};

window.angular = ${origPropName};`
}
