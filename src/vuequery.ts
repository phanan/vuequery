import Vue from 'vue'
import { VueQuery, Selector } from '../types'

import {
  isRoot,
  matches,
  rawSiblings,
  rawChildren,
  siblingsWithSort,
  siblingsUntilWithSort,
  siblingsAllWithSort,
  isVueQuery
} from './helpers'

const $ = (vm: Vue | VueQuery | (Vue | VueQuery)[]): VueQuery | VueQuery[] => {
  if (Array.isArray(vm)) {
    // If the argument is an array, we VueQuery'fy the elements.
    return vm.map((c: Vue | VueQuery): VueQuery => {
      return $(c) as VueQuery
    })
  }

  // Avoid double encapsulation
  if (isVueQuery(vm)) {
    return vm
  }

  // @ts-ignore
  if (!vm._isVue) {
    throw new Error('[VueQuery] Cannot instantiate on a non-Vue element')
  }

  if (!isRoot(vm) && !vm.$options.name) {
    throw new Error('[VueQuery] Non-root component must have a `name` option')
  }

  return {
    vm,
    _isVueQuery: true,

    children (selector?: Selector): VueQuery[] {
      return $(rawChildren(vm, selector)) as VueQuery[]
    },

    closest (selector: Selector): VueQuery | null {
      if (matches(vm, selector)) {
        return $(vm) as VueQuery
      }

      if (!vm.$parent) {
        return null
      }

      const $parent = $(vm.$parent) as VueQuery

      return $parent ? $parent.closest(selector) : null
    },

    find (selector: Selector): VueQuery[] {
      const _find = (component: Vue): Vue[] => {
        let collected: Vue[] = []

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

      return $(_find(vm)) as VueQuery[]
    },

    has (selector: Selector): boolean {
      if (!vm.$children || !vm.$children.length) {
        return false
      }

      for (let i = 0, j = vm.$children.length; i < j; ++i) {
        if (matches(vm.$children[i], selector)) {
          return true
        }

        const $c = $(vm.$children[i]) as VueQuery

        if (!$c) {
          break
        }

        return $c.has(selector)
      }

      return false
    },

    is (selector: Selector | (Extract<Selector, Selector>)[]): boolean {
      if (Array.isArray(selector)) {
        return selector.some(item => matches(vm, item))
      }

      return matches(vm, selector)
    },

    next (selector?: Selector): VueQuery | null {
      const _next = siblingsWithSort(vm, selector ? selector : null, 'Ascending')

      return _next ? $(_next) as VueQuery : null
    },

    nextAll (selector?: Selector): VueQuery[] {
      return $(siblingsAllWithSort(vm, selector ? selector : null, 'Ascending')) as VueQuery[]
    },

    nextUntil (until?: Selector, filter?: Selector): VueQuery[] {
      return $(siblingsUntilWithSort(vm, until, filter, 'Ascending')) as VueQuery[]
    },

    parent (selector?: Selector): VueQuery | null {
      if (isRoot(vm)) {
        return null
      }

      return matches(vm.$parent, selector) ? $(vm.$parent) as VueQuery : null
    },

    parents (selector?: Selector): VueQuery[] {
      const _parents = (component: Vue): Vue[] => {
        if (isRoot(component)) {
          return []
        }

        let collected: Vue[] = []

        if (matches(component.$parent, selector)) {
          collected.push(component.$parent)
        }

        collected = collected.concat(_parents(component.$parent))

        return collected
      }

      return $(_parents(vm)) as VueQuery[]
    },

    parentsUntil (until?: Selector, filter?: Selector): VueQuery[] {
      const _parentsUntil = (component: Vue): Vue[] => {
        if (isRoot(component)) {
          return []
        }

        const collected: Vue[] = []

        if (until && matches(component.$parent, until)) {
          return collected
        }

        if (matches(component.$parent, filter)) {
          collected.push(component.$parent)
        }

        return collected.concat(_parentsUntil(component.$parent))
      }

      return $(_parentsUntil(vm)) as VueQuery[]
    },

    prev (selector?: Selector): VueQuery | null {
      const _prev = siblingsWithSort(vm, selector ? selector : null, 'Descending')

      return _prev ? $(_prev) as VueQuery : null
    },

    prevAll (selector?: Selector): VueQuery[] {
      return $(siblingsAllWithSort(vm, selector ? selector : null, 'Descending')) as VueQuery[]
    },

    prevUntil (until?: Selector, filter?: Selector): VueQuery[] {
      return $(siblingsUntilWithSort(vm, until, filter, 'Descending')) as VueQuery[]
    },

    siblings (selector?: Selector): VueQuery[] {
      const children = rawSiblings(vm, selector)
      const index = children.indexOf(vm)

      if (index > -1) {
        children.splice(index, 1)
      }

      return $(children) as VueQuery[]
    }
  }
}

export default $
