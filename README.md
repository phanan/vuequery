# VueQuery [![Build Status](https://travis-ci.org/phanan/vuequery.svg?branch=master)](https://travis-ci.org/phanan/vuequery)

> Traverse [Vue](https://vuejs.org)'s component tree with ease.

> IMPORTANT: Vue's reactivity/event system is extremely powerful and flexible, and should have 99.99% of your use cases covered. In fact, having to traverse the component tree _almost always_ means you're doing Vue wrong. There are certain edge cases, however, when such is required, and this library aims to aid you there.

## Installation & Usage

### Installation

In a browser, just include `vuequery.min.js` as a script and a `window.VueQuery` function should be ready at your finger tip.

In a modular environment, install VueQuery with `npm` or `yarn`:

``` bash
npm install vuequery
yarn add vuequery
```

Then, import it:

``` js
import VueQuery from 'vuequery'
// or, god forbid
import $ from 'vuequery'
```

### Usage

Similar to jQuery, calling `VueQuery()` on a VueComponent returns a VueQuery instance, which exposes several API's to let you traverse through Vue's component tree.

``` js
// assuming we're currently in a Vue component context
// init a VueQuery instance on the current component
const $vm = VueQuery(this)

// get the original Vue component
$vm.vm

// get the immediate next sibling of the component
$vm.next()

// chaining is supported
$vm.prev('foo').children()[0].find('bar')
```

## API

> As VueQuery is heavily inspired by jQuery, its API signatures are very similar (albeit much less sophisticated) to that of jQuery's traversing module. In fact, the documentation here is more or less copied from [jQuery's](http://api.jquery.com/). Differences, if any, will be explicitly specified.

### `children([selector])`

**Description**: Get the children of the current component, optionally filtered by a `selector`, which can be either

* a string, in which case it will match the components by name. Obviously, for this to work, your components should have the `name` option. This is a good Vue practice anyway.
* a VueComponent instance
* a VueQuery instance, in which case it will match the encapsulated VueComponent instance

**Return Values**: `Array.<VueQuery>|[]`

### `closest(selector)`

**Description**: Get the first component that matches the selector by testing the current component itself and traversing up through its ancestors in the component tree.

**Return Values**: `VueQuery|null`

### `find(selector)`

**Description**: Get the descendants of the current component, filtered by a selector.

**Return Values**: `Array.<VueQuery>|[]`

### `has(selector)`

> Note: This API's behavior is different from its jQuery counterpart.

**Description**: Check if the current component has any component that matches the selector in its descendant tree.

**Return Values**: `Boolean`

### `is(selector)`

**Description**: Check if the current component matches the selector.

**Return Values**: `Boolean`

### `next([selector])`

**Description**: Get the immediately following sibling of the current component. If a selector is provided, it retrieves the next sibling only if it matches that selector.

**Return Values**: `VueQuery|null`

### `nextAll([selector])`

**Description**: Get all following siblings of the current component, optionally filtered by a selector.

**Return Values**: `Array.<VueQuery>|[]`

### `nextUntil([selector][, filter])`

**Description**: Get all following siblings of the current component, up to but not including the component matched by the selector passed.
If the selector is not matched or is not supplied, all following siblings will be selected; in these cases it selects the same components as the `.nextAll()` method does when no selector is provided.

The method optionally accepts a `filter` expression for its second argument. If this argument is supplied, the components will be filtered by testing whether they match it.

**Return Values**: `Array.<VueQuery>|[]`

### `parent([selector])`

**Description**: Get the parent of the current component. If the selector is supplied, the parent component will only be returned if it matches it.

**Return Values**: `VueQuery|null`

### `parents([selector])`

**Description**: Get the ancestors of the current component, optionally filtered by a selector.

**Return Values**: `Array.<VueQuery>|[]`

### `parentsUntil([selector][, filter])`

**Description**: Get the ancestors of the current component, up to but not including the component matched by the selector passed.
If the selector is not matched or is not supplied, all ancestors will be selected; in these cases it selects the same components as the `.parents()` method does when no selector is provided.

The method optionally accepts a `filter` expression for its second argument. If this argument is supplied, the components will be filtered by testing whether they match it.

**Return Values**: `Array.<VueQuery>|[]`

### `prev([selector])`

**Description**: Get the immediately preceding sibling of the current component. If a selector is provided, it retrieves the previous sibling only if it matches that selector.

**Return Values**: `VueQuery|null`

### `prevAll([selector])`

**Description**: Get all preceding siblings of the current component, optionally filtered by a selector.

**Return Values**: `Array.<VueQuery>|[]`

### `prevUntil([selector][, filter])`

**Description**: Get all preceding siblings of the current component, up to but not including the component matched by the selector passed.
If the selector is not matched or is not supplied, all preceding siblings will be selected; in these cases it selects the same components as the `.nextAll()` method does when no selector is provided.

The method optionally accepts a `filter` expression for its second argument. If this argument is supplied, the components will be filtered by testing whether they match it.

### `siblings([selector])`

**Description**: Get the siblings of the current component, optionally filtered by a selector. The original component is not included among the siblings.

**Return Values**: `Array.<VueQuery>|[]`

## License

MIT &copy; [Phan An](http://phanan.net)
