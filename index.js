'use strict'

const deline = str => str.replace(/[\r\n]/g, ' ').replace(/\s{2,}/g, ' ')

module.exports = function reassignAngularLoader(source) {
  this.cacheable()

  const isAngularItself = /angular[/\\]angular\.js/.test(this.resourcePath)
  const isAngularWrapper = /angular[/\\]index\.js/.test(this.resourcePath)
  const isAngularRequired = /(\.|\s|;|^)angular(\.|\[|\s|;|=|$)/.test(source)

  const windowRefName = '__ral_windowRef'
  const origAngularName = '__ral_origAngular'

  if (isAngularItself) {
    const header = '/* REASSIGN ANGULAR LOADER -- ANGULAR ITSELF HEADER */'
    const footer = '/* REASSIGN ANGULAR LOADER -- ANGULAR ITSELF FOOTER */'
    return `${header} ${source}; ${footer}`
  } else if (isAngularWrapper) {
    const header = deline(`
      /* REASSIGN ANGULAR LOADER -- ANGULAR WRAPPER HEADER */
      var ${windowRefName} = typeof window !== 'undefined' ? window : {};
      var ${origAngularName} = ${windowRefName}.angular;
      ${windowRefName}.angular = undefined;`)
    const footer = deline(`
      /* REASSIGN ANGULAR LOADER -- ANGULAR WRAPPER FOOTER */
      ${windowRefName}.angular = ${origAngularName};`)

    return `${header} ${source}; ${footer}`
  } else if (isAngularRequired) {
    const isLetDefined = /let\s+angular/.test(source)
    const isConstDefined = /const\s+angular/.test(source)

    const glbDefinitionStr = `${windowRefName}.angular = require('angular');`
    const varDefinitionStr = isConstDefined || isLetDefined
      ? '/* ANGULAR VARIABLE DEFINITION CAN NOT BE OVERRIDDEN */'
      : 'var angular = require("angular");'

    const header = deline(`
      /* REASSIGN ANGULAR LOADER -- HEADER */
      var ${windowRefName} = typeof window !== 'undefined' ? window : {};
      var ${origAngularName} = ${windowRefName}.angular;
      ${glbDefinitionStr}
      ${varDefinitionStr}`)

    const footer = deline(`
      /* REASSIGN ANGULAR LOADER -- FOOTER */
      ${windowRefName}.angular = ${origAngularName};`)

    return `${header} ${source}; ${footer}`
  } else {
    return source
  }
}
