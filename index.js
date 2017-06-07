'use strict'

let _uniqueId = 0
const uniqueId = () => ++_uniqueId
const deline = str => str.replace(/[\r\n]/g, ' ').replace(/\s{2,}/g, ' ')

module.exports = function reassignAngularLoader(source) {
  this.cacheable()
  const origPropName = `__originalAngular${uniqueId()}`

  const needDefineAngular = !/(var|let|const)\s+angular\s*=\s*require\(['"]angular["']\)/.test(source)
  const angularDefineStr = needDefineAngular
    ? 'var angular = require("angular");'
    : '/* ANGULAR ALREADY DEFINED AS LOCAL VARIABLE */'

  const header = deline(`
    /* REASSIGN ANGULAR LOADER HEADER -- https://github.com/nskazki/reassign-angular-loader */

    var ${origPropName} = window.angular;
    delete window.angular;
    window.angular = require('angular');
    ${angularDefineStr}`)

  const footer = deline(`
    /* REASSIGN ANGULAR LOADER FOOTER -- https://github.com/nskazki/reassign-angular-loader */
    window.angular = ${origPropName};`)

  return `${header} ${source}; ${footer}`
}
