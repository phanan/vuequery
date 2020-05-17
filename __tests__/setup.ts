const globalVue = require('vue/dist/vue.js')

globalVue.component('noop', {
  template: '<i></i>',
})

globalVue.component('foo', {
  name: 'foo',
  template: '<p>This is foo</p>',
})

globalVue.component('bar', {
  name: 'bar',
  template: '<div><foo/></div>',
})

globalVue.component('baz', {
  name: 'baz',
  template: '<div><bar/></div>',
})

globalVue.component('qux', {
  name: 'qux',
  template: '<div><baz/><noop/><baz/><baz/></div>',
})
