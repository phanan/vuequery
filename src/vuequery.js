import warn from './utils'
import {
  isRoot,
  matches,
  rawSiblings,
  rawChildren,
  siblingsWithSort,
  siblingsUntilWithSort,
  siblingsAllWithSort
} from './helpers'

const $ = vm => {
  if (Array.isArray(vm)) {
    // If the argument is an array, we VueQuery'fy the elements.
    return vm.map(c => $(c))
  }

  if (!vm) {
    return null
  }

  if (!vm._isVue) {
    warn(`Can't init on a non-Vue component`, vm)
    return null
  }

  if (!isRoot(vm) && !vm.$options.name) {
    warn('Non-root component must have a `name` option', vm)
    return null
  }

  return {
    /**
     * The original VueComponent
     * @type {VueComponent}
     */
    vm,

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
    children (selector = null) {
      return $(rawChildren(vm, selector))
    },

    /**
     * Get the first component that matches the selector by testing the current component itself
     * and traversing up through its ancestors in the component tree.
     * @param  {string|VueComponent|VueQuery} selector
     * @return {?VueQuery}
     */
    closest (selector = null) {
      if (matches(vm, selector)) {
        return $(vm)
      }

      if (!vm.$parent) {
        return null
      }

      const $parent = $(vm.$parent)
      return $parent ? $parent.closest(selector) : null
    },

    /**
     * Get the descendants of the current component, optionally filtered by a selector.
     * @param  {string|VueComponent|VueQuery} selector [description]
     * @return {Array.<VueQuery>}
     */
    find (selector = null) {
      const _find = component => {
        let collected = []

        if (!component.$children || !component.$children.length) {
          return []
        }

        component.$children.forEach(c => {
          if (matches(c, selector)) {
            collected.push(c)
          }
          collected = collected.concat(_find(c))
        })

        return collected
      }

      return $(_find(vm))
    },

    /**
     * Check if the current component has the selector in its descendant tree.
     * @param  {string|VueComponent|VueQuery}  selector
     * @return {Boolean}
     */
    has (selector) {
      if (!vm.$children || !vm.$children.length) {
        return false
      }

      for (let i = 0, j = vm.$children.length; i < j; ++i) {
        if (matches(vm.$children[i], selector)) {
          return true
        }
        const $c = $(vm.$children[i])
        if (!$c) break
        return $c.has(selector)
      }

      return false
    },

    /**
     * Check if the current component matches the selector (which can be a string, a
     * VueComponent/VueQuery instance, or an array of those, in which case a single
     * match will return true.)
     * @param  {Array|string|VueComponent|VueQuery}  selector
     * @return {Boolean}
     */
    is (selector) {
      if (Array.isArray(selector)) {
        for (let i = 0, j = selector.length; i < j; ++i) {
          if (matches(vm, selector[i])) {
            return true
          }
        }

        return false
      }

      return matches(vm, selector)
    },

    /**
     * Get the immediately following sibling of the current component.
     * If a selector is provided, it retrieves the next sibling only if it matches that selector.
     * @param  {string|VueComponent|VueQuery}   selector
     * @return {?VueQuery}
     */
    next (selector = null) {
      return $(siblingsWithSort(vm, selector, true))
    },

    /**
     * Get all following siblings of the current component, optionally filtered by a selector.
     * @param  {string|VueComponent|VueQuery}   selector
     * @return {Array.<VueQuery>}
     */
    nextAll (selector = null) {
      return $(siblingsAllWithSort(vm, selector, true))
    },

    /**
     * Get all following siblings of the current component, up to but not including the component
     * matched by the selector passed.
     * @param  {string|VueComponent|VueQuery} until
     * @param  {string|VueComponent|VueQuery} filter
     * @return {Array.<VueQuery>}
     */
    nextUntil (until = null, filter = null) {
      return $(siblingsUntilWithSort(vm, until, filter, true))
    },

    /**
     * Get the parent of the current component, optionally filtered by a selector.
     * @param  {string|VueComponent|VueQuery} selector
     * @return {?VueQuery}
     */
    parent (selector = null) {
      if (isRoot(vm)) {
        return null
      }

      return matches(vm.$parent, selector) ? $(vm.$parent) : null
    },

    /**
     * Get the ancestors of the current component, optionally filtered by a selector.
     * @param  {string|VueComponent|VueQuery} selector
     * @return {?VueQuery}
     */
    parents (selector = null) {
      const _parents = component => {
        if (isRoot(component)) {
          return []
        }

        let collected = []
        if (matches(component.$parent, selector)) {
          collected.push(component.$parent)
        }

        collected = collected.concat(_parents(component.$parent))
        return collected
      }

      return $(_parents(vm))
    },

    /**
     * Get the ancestors of the current component, up to but not including the component matched
     * by the selector.
     * @param  {string|VueComponent|VueQuery} until
     * @param  {string|VueComponent|VueQuery} filter
     * @return {Array.<VueQuery>}
     */
    parentsUntil (until = null, filter = null) {
      const _parentsUntil = component => {
        if (isRoot(component)) {
          return []
        }

        let collected = []
        if (until && matches(component.$parent, until)) {
          return collected
        }
        if (matches(component.$parent, filter)) {
          collected.push(component.$parent)
        }

        collected = collected.concat(_parentsUntil(component.$parent))
        return collected
      }

      return $(_parentsUntil(vm))
    },

    /**
     * Get the immediately preceding sibling of the current component.
     * If a selector is provided, it retrieves the previous sibling only if it matches that selector.
     * @param  {string|VueComponent|VueQuery} selector
     * @return {?VueQuery}
     */
    prev (selector = null) {
      return $(siblingsWithSort(vm, selector, false))
    },

    /**
     * Get all preceding siblings of the current component, optionally filtered by a selector.
     * @param  {string|VueComponent|VueQuery} selector
     * @return {Array.<VueQuery>}
     */
    prevAll (selector = null) {
      return $(siblingsAllWithSort(vm, selector, false))
    },

    /**
     * Get all preceding siblings of the current component, up to but not including the component
     * matched by the selector.
     * @param  {string|VueComponent|VueQuery} until
     * @param  {string|VueComponent|VueQuery} filter
     * @return {Array.<VueQuery>}
     */
    prevUntil (until = null, filter = null) {
      return $(siblingsUntilWithSort(vm, until, filter, false))
    },

    /**
     * Get the siblings of the current component, optionally filtered by a selector.
     * @param  {string|VueComponent|VueQuery} selector
     * @return {Array.<VueQuery>}
     */
    siblings (selector = null) {
      const children = rawSiblings(vm, selector)
      const index = children.indexOf(vm)
      if (index > -1) {
        children.splice(index, 1)
      }

      return $(children)
    }
  }
}

export default $
