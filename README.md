# reassign-angular-loader

Yet another way to have more than one `angular` app on the same page. See `index.js` to get a clear idea how this works.

My use case:
 - one [angular@1.6](https://github.com/angular/angular.js) widget bundled via [webpack@1](https://github.com/webpack/webpack) into the one `widget.bundle.js`
 - close to ten dependencies which used global defined `angular`, like [ng-onload](https://github.com/mikaturunen/ng-onload/blob/master/lib/ng-onload.js#L45) or [angular-once](https://github.com/tadeuszwojcik/angular-once/blob/master/once.js#L173)
 - thousand of unknown environments which will include that widget

```
yarn -D reassign-angular-loader
```

part of **webpack.config.js**

```js
const webpack = require('webpack')
const { sync: moduleResolve } = require('resolve')
const { resolve: pathResolve } = require('path')

const widgetResolve = (...p) => pathResolve(__dirname, 'widget/project/dir', ...p)
const widgetModule = (name) => moduleResolve(name, { basedir: widgetResolve() })

module.exports = {
  module: {
    loaders: [{
      include: [
        // root
        widgetResolve('src/index.js')
        // node_modules
        widgetModule('ng-onload/release/ng-onload.min.js'),
        widgetModule('angular-animate-model-change/src/index.js'),
        widgetModule('angular-debounce/dist/angular-debounce.js'),
        widgetModule('angular-mocks/angular-mocks.js'),
        widgetModule('angular-once/once.js'),
        widgetModule('angular-resource/angular-resource.js'),
        widgetModule('angular-sanitize/angular-sanitize.js'),
        widgetModule('angular-socialshare/dist/angular-socialshare.js'),
        widgetModule('angular-timeago/dist/angular-timeago.js'),
        widgetModule('angular-ui-notification/dist/angular-ui-notification.js')
      ],
      loader: 'reassign-angular-loader'
    }]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      mangle: { except: ['angular'] },
      compress: { warnings: false }
    }))
  ]
}
```

**some-bit.index.js**

```js
const angular = require('angular')

const ngOnce = require('angular-once/once.js') && 'once'
const ngResource = require('angular-resource/angular-resource.js') && 'ngResource'
const ngSanitize = require('angular-sanitize/angular-sanitize.js') && 'ngSanitize'

module.exports = angular
  .module('widget.some-bit', [
    ngOnce,
    ngResource,
    ngSanitize
  ])
  .name

require('./some-bit.component.css')
require('./some-bit.component.js')
```
