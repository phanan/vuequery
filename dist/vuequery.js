(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["VueQuery"] = factory();
	else
		root["VueQuery"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = __webpack_require__(2);

var _utils2 = _interopRequireDefault(_utils);

var _helpers = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $ = function $(vm) {
  if (Array.isArray(vm)) {
    // If the argument is an array, we VueQuery'fy the elements.
    return vm.map(function (c) {
      return $(c);
    });
  }

  if (!vm) {
    return null;
  }

  if (!vm._isVue) {
    (0, _utils2.default)('Can\'t init on a non-Vue component', vm);
    return null;
  }

  if (!(0, _helpers.isRoot)(vm) && !vm.$options.name) {
    (0, _utils2.default)('Non-root component must have a `name` option', vm);
    return null;
  }

  return {
    /**
     * The original VueComponent
     * @type {VueComponent}
     */
    vm: vm,

    /**
     * Specify our object to be VueQuery
     * @type {Boolean}
     */
    _isVueQuery: true,

    /**
     * Get the children of the current component, optionally filtered by a selector.
     * @param  {string|VueComponent|VueQuery} selector
     * @return {Array.<VueQuery>}
     */
    children: function children() {
      var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      return $((0, _helpers.rawChildren)(vm, selector));
    },


    /**
     * Get the first component that matches the selector by testing the current component itself
     * and traversing up through its ancestors in the component tree.
     * @param  {string|VueComponent|VueQuery} selector
     * @return {?VueQuery}
     */
    closest: function closest() {
      var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if ((0, _helpers.matches)(vm, selector)) {
        return $(vm);
      }

      if (!vm.$parent) {
        return null;
      }

      var $parent = $(vm.$parent);
      return $parent ? $parent.closest(selector) : null;
    },


    /**
     * Get the descendants of the current component, optionally filtered by a selector.
     * @param  {string|VueComponent|VueQuery} selector [description]
     * @return {Array.<VueQuery>}
     */
    find: function find() {
      var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      var _find = function _find(component) {
        var collected = [];

        if (!component.$children || !component.$children.length) {
          return [];
        }

        component.$children.forEach(function (c) {
          if ((0, _helpers.matches)(c, selector)) {
            collected.push(c);
          }
          collected = collected.concat(_find(c));
        });

        return collected;
      };

      return $(_find(vm));
    },


    /**
     * Check if the current component has the selector in its descendant tree.
     * @param  {string|VueComponent|VueQuery}  selector
     * @return {Boolean}
     */
    has: function has(selector) {
      if (!vm.$children || !vm.$children.length) {
        return false;
      }

      for (var i = 0, j = vm.$children.length; i < j; ++i) {
        if ((0, _helpers.matches)(vm.$children[i], selector)) {
          return true;
        }
        var $c = $(vm.$children[i]);
        if (!$c) break;
        return $c.has(selector);
      }

      return false;
    },


    /**
     * Check if the current component matches the selector (which can be a string, a
     * VueComponent/VueQuery instance, or an array of those, in which case a single
     * match will return true.)
     * @param  {Array|string|VueComponent|VueQuery}  selector
     * @return {Boolean}
     */
    is: function is(selector) {
      if (Array.isArray(selector)) {
        for (var i = 0, j = selector.length; i < j; ++i) {
          if ((0, _helpers.matches)(vm, selector[i])) {
            return true;
          }
        }

        return false;
      }

      return (0, _helpers.matches)(vm, selector);
    },


    /**
     * Get the immediately following sibling of the current component.
     * If a selector is provided, it retrieves the next sibling only if it matches that selector.
     * @param  {string|VueComponent|VueQuery}   selector
     * @return {?VueQuery}
     */
    next: function next() {
      var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      return $((0, _helpers.siblingsWithSort)(vm, selector, true));
    },


    /**
     * Get all following siblings of the current component, optionally filtered by a selector.
     * @param  {string|VueComponent|VueQuery}   selector
     * @return {Array.<VueQuery>}
     */
    nextAll: function nextAll(selector) {
      return $((0, _helpers.siblingsAllWithSort)(vm, selector, true));
    },


    /**
     * Get all following siblings of the current component, up to but not including the component
     * matched by the selector passed.
     * @param  {string|VueComponent|VueQuery} until
     * @param  {string|VueComponent|VueQuery} filter
     * @return {Array.<VueQuery>}
     */
    nextUntil: function nextUntil(until, filter) {
      return $((0, _helpers.siblingsUntilWithSort)(vm, until, filter, true));
    },


    /**
     * Get the parent of the current component, optionally filtered by a selector.
     * @param  {string|VueComponent|VueQuery} selector
     * @return {?VueQuery}
     */
    parent: function parent(selector) {
      if ((0, _helpers.isRoot)(vm)) {
        return null;
      }

      return (0, _helpers.matches)(vm.$parent, selector) ? $(vm.$parent) : null;
    },


    /**
     * Get the ancestors of the current component, optionally filtered by a selector.
     * @param  {string|VueComponent|VueQuery} selector
     * @return {?VueQuery}
     */
    parents: function parents(selector) {
      var _parents = function _parents(component) {
        if ((0, _helpers.isRoot)(component)) {
          return [];
        }

        var collected = [];
        if ((0, _helpers.matches)(component.$parent, selector)) {
          collected.push(component.$parent);
        }

        collected = collected.concat(_parents(component.$parent));
        return collected;
      };

      return $(_parents(vm));
    },


    /**
     * Get the ancestors of the current component, up to but not including the component matched
     * by the selector.
     * @param  {string|VueComponent|VueQuery} until
     * @param  {string|VueComponent|VueQuery} filter
     * @return {Array.<VueQuery>}
     */
    parentsUntil: function parentsUntil(until, filter) {
      var _parentsUntil = function _parentsUntil(component) {
        if ((0, _helpers.isRoot)(component)) {
          return [];
        }

        var collected = [];
        if (until && (0, _helpers.matches)(component.$parent, until)) {
          return collected;
        }
        if ((0, _helpers.matches)(component.$parent, filter)) {
          collected.push(component.$parent);
        }

        collected = collected.concat(_parentsUntil(component.$parent));
        return collected;
      };

      return $(_parentsUntil(vm));
    },


    /**
     * Get the immediately preceding sibling of the current component.
     * If a selector is provided, it retrieves the previous sibling only if it matches that selector.
     * @param  {string|VueComponent|VueQuery} selector
     * @return {?VueQuery}
     */
    prev: function prev(selector) {
      return $((0, _helpers.siblingsWithSort)(vm, selector, false));
    },


    /**
     * Get all preceding siblings of the current component, optionally filtered by a selector.
     * @param  {string|VueComponent|VueQuery} selector
     * @return {Array.<VueQuery>}
     */
    prevAll: function prevAll(selector) {
      return $((0, _helpers.siblingsAllWithSort)(vm, selector, false));
    },


    /**
     * Get all preceding siblings of the current component, up to but not including the component
     * matched by the selector.
     * @param  {string|VueComponent|VueQuery} until
     * @param  {string|VueComponent|VueQuery} filter
     * @return {Array.<VueQuery>}
     */
    prevUntil: function prevUntil(until, filter) {
      return $((0, _helpers.siblingsUntilWithSort)(vm, until, filter, false));
    },


    /**
     * Get the siblings of the current component, optionally filtered by a selector.
     * @param  {string|VueComponent|VueQuery} selector
     * @return {Array.<VueQuery>}
     */
    siblings: function siblings(selector) {
      var children = (0, _helpers.rawSiblings)(vm, selector);
      var index = children.indexOf(vm);
      if (index > -1) {
        children.splice(index, 1);
      }

      return $(children);
    }
  };
};

exports.default = $;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Checks if a Vue component matches against a selector.
 * The selector can be either:
 * - a string (name of the component)
 * - a VueComponent object
 * - a VueQuery object
 * @param  {VueComponent} vm
 * @param  {string|VueComponent|VueQuery} selector
 * @return {Boolean}
 */
var matches = exports.matches = function matches(vm, selector) {
  if (!selector) {
    return true;
  }

  if (typeof selector === 'string' || selector instanceof String) {
    return vm.$options.name === selector;
  }

  if (selector._isVueQuery) {
    selector = selector.vm;
  }

  return vm === selector;
};

/**
 * Get all children of a Vue component, optionally filtered by a selector.
 * @param  {VueComponent} vm
 * @param  {string|VueComponent|VueQuery} selector
 * @return {Array.<VueComponent>}
 */
var rawChildren = exports.rawChildren = function rawChildren(vm) {
  var selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  var collected = [];
  vm.$children.forEach(function (c) {
    if (matches(c, selector)) {
      collected.push(c);
    }
  });

  return collected;
};

/**
 * Get all siblings of a Vue component, optionally filtered by a selector.
 * @param  {VueComponent} vm
 * @param  {string|VueComponent|VueQuery} selector
 * @param  {Boolean} withSelf Whether to include the current vm
 * @return {Array.<VueComponent>}
 */
var rawSiblings = exports.rawSiblings = function rawSiblings(vm) {
  var selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var withSelf = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  if (isRoot(vm)) {
    return [];
  }

  var collected = rawChildren(vm.$parent, selector);

  if (!withSelf) {
    var index = collected.indexOf(vm);
    if (index > -1) {
      collected.splice(index, 1);
    }
  }

  return collected;
};

/**
 * Check if a Vue component is the root instance.
 * @param  {VueComponent} vm
 * @return {Boolean}
 */
var isRoot = exports.isRoot = function isRoot(vm) {
  return vm.$root === vm;
};

/**
 * Get the first sibling of a Vue component filtered by a selector.
 * @param  {VueComponent} vm
 * @param  {string|VueComponent|VueQuery} selector
 * @param  {Boolean} ascending The order of the siblings
 * @return {?VueComponent}
 */
var siblingsWithSort = exports.siblingsWithSort = function siblingsWithSort(vm, selector, ascending) {
  var siblings = rawSiblings(vm);
  if (!siblings.length) {
    return null;
  }
  var i = siblings.indexOf(vm);
  if (ascending) {
    if (i === siblings.length - 1) {
      return null;
    }
    return matches(siblings[i + 1], selector) ? siblings[i + 1] : null;
  } else {
    if (i === 0) {
      return null;
    }
    return matches(siblings[i - 1], selector) ? siblings[i - 1] : null;
  }
};

/**
 * Get all siblings of a Vue component filtered by a selector.
 * @param  {VueComponent} vm
 * @param  {string|VueComponent|VueQuery} selector
 * @param  {Boolean} ascending The order of the siblings
 * @return {Array.<VueComponent>}
 */
var siblingsAllWithSort = exports.siblingsAllWithSort = function siblingsAllWithSort(vm, selector, ascending) {
  var siblings = rawSiblings(vm, selector);
  if (!siblings.length) {
    return [];
  }

  var i = siblings.indexOf(vm);
  return ascending ? siblings.slice(i + 1) : siblings.slice(0, i).reverse();
};

/**
 * Get all siblings of a Vue component filtered by a "filter" selector, and up to but
 * not including the "until" selector passed.
 * @param  {VueComponent} vm
 * @param  {string|VueComponent|VueQuery} until
 * @param  {string|VueComponent|VueQuery} filter
 * @param  {Boolean} ascending The order of the siblings
 * @return {Array.<VueComponent>}
 */
var siblingsUntilWithSort = exports.siblingsUntilWithSort = function siblingsUntilWithSort(vm, until, filter, ascending) {
  var siblings = rawSiblings(vm);
  if (!siblings.length) {
    return [];
  }

  if (!ascending) {
    siblings = siblings.reverse();
  }
  siblings = siblings.slice(siblings.indexOf(vm) + 1);

  if (!until) {
    return siblings;
  }

  var collected = [];
  for (var i = 0, j = siblings.length; i < j; ++i) {
    if (matches(siblings[i], until)) {
      break;
    }
    if (matches(siblings[i], filter)) {
      collected.push(siblings[i]);
    }
  }

  return collected;
};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
var warn = function warn(msg, vm) {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  if (vm.$options && vm.$options.__file) {
    msg += ' at ' + vm.$options.__file;
  }
  console.error('[VueQuery] ' + msg);
};

exports.default = warn;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 3 */
/***/ function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var _vuequery = __webpack_require__(0);

var _vuequery2 = _interopRequireDefault(_vuequery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _vuequery2.default;

/***/ }
/******/ ]);
});