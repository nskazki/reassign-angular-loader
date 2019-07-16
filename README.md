# reassign-angular-loader

Yet another way to run more than one `angular@1` app on the same page.

My use case: I develop a widget on top of [`angular@1.7`](https://github.com/angular/angular.js) which includes a few dependencies rely on `window.angular`
([ng-onload](https://github.com/mikaturunen/ng-onload/blob/master/lib/ng-onload.js#L45), [angular-once](https://github.com/tadeuszwojcik/angular-once/blob/master/once.js#L173), ...),
which is not acceptable as the widget intended to be included on 3rd party sites.


```
yarn -D reassign-angular-loader
```

**webpack.config.js**

```js
const webpack = require('webpack')

module.exports = {
  /* ... */
  module: {
    loaders: [{
      use: 'reassign-angular-loader',
      test: '*.js'
    }]
  }
}
```
