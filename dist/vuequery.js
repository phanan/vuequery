'use strict';

function isVueQuery(selector) {
    return selector._isVueQuery === true;
}
/**
 * Checks if a Vue component matches against a selector.
 * The selector can be either:
 * - a string (name of the component)
 * - a VueComponent object
 * - a VueQuery object
 */
var matches = function (vm, selector) {
    if (!selector) {
        return true;
    }
    if (selector instanceof String || typeof selector === 'string') {
        return vm.$options.name === selector;
    }
    if (isVueQuery(selector)) {
        return selector.vm === vm;
    }
    return selector === vm;
};
/**
 * Get all children of a Vue component, optionally filtered by a selector.
 */
var rawChildren = function (vm, selector) {
    var collected = [];
    vm.$children.forEach(function (child) {
        if (matches(child, selector)) {
            collected.push(child);
        }
    });
    return collected;
};
/**
 * Get all siblings of a Vue component, optionally filtered by a selector.
 * @param  {Boolean} withSelf Whether to include the current vm
 */
var rawSiblings = function (vm, selector, withSelf) {
    if (withSelf === void 0) { withSelf = true; }
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
 */
var isRoot = function (vm) {
    return vm.$root === vm;
};
/**
 * Get the first sibling of a Vue component filtered by a selector.
 */
var siblingsWithSort = function (vm, selector, direction) {
    var siblings = rawSiblings(vm);
    if (!siblings.length) {
        return null;
    }
    var i = siblings.indexOf(vm);
    if (direction === "Ascending") {
        if (i === siblings.length - 1) {
            return null;
        }
        return matches(siblings[i + 1], selector) ? siblings[i + 1] : null;
    }
    if (i === 0) {
        return null;
    }
    return matches(siblings[i - 1], selector) ? siblings[i - 1] : null;
};
/**
 * Get all siblings of a Vue component filtered by a selector.
 */
var siblingsAllWithSort = function (vm, selector, direction) {
    var siblings = rawSiblings(vm, selector);
    if (!siblings.length) {
        return [];
    }
    var i = siblings.indexOf(vm);
    return direction === "Ascending"
        ? siblings.slice(i + 1)
        : siblings.slice(0, i).reverse();
};
/**
 * Get all siblings of a Vue component filtered by a "filter" selector, and up to but
 * not including the "until" selector passed.
 */
var siblingsUntilWithSort = function (vm, until, filter, direction) {
    var siblings = rawSiblings(vm);
    if (!siblings.length) {
        return [];
    }
    if (direction === "Descending") {
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

var $ = function (vm) {
    if (Array.isArray(vm)) {
        // If the argument is an array, we VueQuery'fy the elements.
        return vm.map(function (c) {
            return $(c);
        });
    }
    // Avoid double encapsulation
    if (isVueQuery(vm)) {
        return vm;
    }
    // @ts-ignore
    if (!vm._isVue) {
        throw new Error('[VueQuery] Cannot instantiate on a non-Vue element');
    }
    if (!isRoot(vm) && !vm.$options.name) {
        throw new Error('[VueQuery] Non-root component must have a `name` option');
    }
    return {
        vm: vm,
        _isVueQuery: true,
        children: function (selector) {
            return $(rawChildren(vm, selector));
        },
        closest: function (selector) {
            if (matches(vm, selector)) {
                return $(vm);
            }
            if (!vm.$parent) {
                return null;
            }
            var $parent = $(vm.$parent);
            return $parent ? $parent.closest(selector) : null;
        },
        find: function (selector) {
            var _find = function (component) {
                var collected = [];
                if (!component.$children || !component.$children.length) {
                    return [];
                }
                component.$children.forEach(function (c) {
                    if (matches(c, selector)) {
                        collected.push(c);
                    }
                    collected = collected.concat(_find(c));
                });
                return collected;
            };
            return $(_find(vm));
        },
        has: function (selector) {
            if (!vm.$children || !vm.$children.length) {
                return false;
            }
            for (var i = 0, j = vm.$children.length; i < j; ++i) {
                if (matches(vm.$children[i], selector)) {
                    return true;
                }
                var $c = $(vm.$children[i]);
                if (!$c) {
                    break;
                }
                return $c.has(selector);
            }
            return false;
        },
        is: function (selector) {
            if (Array.isArray(selector)) {
                return selector.some(function (item) { return matches(vm, item); });
            }
            return matches(vm, selector);
        },
        next: function (selector) {
            var _next = siblingsWithSort(vm, selector ? selector : null, 'Ascending');
            return _next ? $(_next) : null;
        },
        nextAll: function (selector) {
            return $(siblingsAllWithSort(vm, selector ? selector : null, 'Ascending'));
        },
        nextUntil: function (until, filter) {
            return $(siblingsUntilWithSort(vm, until, filter, 'Ascending'));
        },
        parent: function (selector) {
            if (isRoot(vm)) {
                return null;
            }
            return matches(vm.$parent, selector) ? $(vm.$parent) : null;
        },
        parents: function (selector) {
            var _parents = function (component) {
                if (isRoot(component)) {
                    return [];
                }
                var collected = [];
                if (matches(component.$parent, selector)) {
                    collected.push(component.$parent);
                }
                collected = collected.concat(_parents(component.$parent));
                return collected;
            };
            return $(_parents(vm));
        },
        parentsUntil: function (until, filter) {
            var _parentsUntil = function (component) {
                if (isRoot(component)) {
                    return [];
                }
                var collected = [];
                if (until && matches(component.$parent, until)) {
                    return collected;
                }
                if (matches(component.$parent, filter)) {
                    collected.push(component.$parent);
                }
                return collected.concat(_parentsUntil(component.$parent));
            };
            return $(_parentsUntil(vm));
        },
        prev: function (selector) {
            var _prev = siblingsWithSort(vm, selector ? selector : null, 'Descending');
            return _prev ? $(_prev) : null;
        },
        prevAll: function (selector) {
            return $(siblingsAllWithSort(vm, selector ? selector : null, 'Descending'));
        },
        prevUntil: function (until, filter) {
            return $(siblingsUntilWithSort(vm, until, filter, 'Descending'));
        },
        siblings: function (selector) {
            var children = rawSiblings(vm, selector);
            var index = children.indexOf(vm);
            if (index > -1) {
                children.splice(index, 1);
            }
            return $(children);
        }
    };
};

module.exports = $;
