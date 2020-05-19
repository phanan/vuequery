import Vue from 'vue'

export type Selector = string | Vue | VueQuery

export type SortDirection = 'Ascending' | 'Descending'

export interface VueQuery {
  vm: Vue
  _isVueQuery: true

  /**
   * Get the children of the current component, optionally filtered by a selector.
   */
  children(selector?: Selector): VueQuery[]

  /**
   * Get the first component that matches the selector by testing the current component itself
   * and traversing up through its ancestors in the component tree.
   */
  closest(selector: Selector): VueQuery | null

  /**
   * Get the descendants of the current component, filtered by a selector.
   */
  find(selector: Selector): VueQuery[]

  /**
   * Check if the current component has the selector in its descendant tree.
   */
  has(selector: Selector): boolean

  /**
   * Check if the current component matches the selector (which can be a string, a
   * Vue/VueQuery instance, or an array of those, in which case a single
   * match will return true.)
   */
  is(selector: Selector): boolean

  /**
   * Get the immediately following sibling of the current component.
   * If a selector is provided, it retrieves the next sibling only if it matches that selector.
   */
  next(selector?: Selector): VueQuery | null

  /**
   * Get all following siblings of the current component, optionally filtered by a selector.
   */
  nextAll(selector?: Selector): VueQuery[]

  /**
   * Get all following siblings of the current component, up to but not including the component
   * matched by the selector passed.
   */
  nextUntil(until?: Selector, filter?: Selector): VueQuery[]

  /**
   * Get the parent of the current component, optionally filtered by a selector.
   */
  parent(selector?: Selector): VueQuery | null

  /**
   * Get the ancestors of the current component, optionally filtered by a selector.
   */
  parents(selector?: Selector): VueQuery[]

  /**
   * Get the ancestors of the current component, up to but not including the component matched
   * by the selector.
   */
  parentsUntil(until?: Selector, filter?: Selector): VueQuery[]

  /**
   * Get the immediately preceding sibling of the current component.
   * If a selector is provided, it retrieves the previous sibling only if it matches that selector.
   */
  prev(selector?: Selector): VueQuery | null

  /**
   * Get all preceding siblings of the current component, optionally filtered by a selector.
   */
  prevAll(selector?: Selector): VueQuery[]

  /**
   * Get all preceding siblings of the current component, up to but not including the component
   * matched by the selector.
   */
  prevUntil(until?: Selector, filter?: Selector): VueQuery[]

  /**
   * Get the siblings of the current component, optionally filtered by a selector.
   */
  siblings(selector?: Selector): VueQuery[]
}

export default function $(vm: Vue | VueQuery | (Vue | VueQuery)[]): VueQuery | VueQuery[]
