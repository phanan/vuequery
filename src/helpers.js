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
export const matches = (vm, selector) => {
  if (!selector) {
    return true;
  }

  if (typeof selector === "string" || selector instanceof String) {
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
export const rawChildren = (vm, selector = null) => {
  const collected = [];
  vm.$children.forEach(c => {
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
export const rawSiblings = (vm, selector = null, withSelf = true) => {
  if (isRoot(vm)) {
    return [];
  }

  const collected = rawChildren(vm.$parent, selector);

  if (!withSelf) {
    const index = collected.indexOf(vm);
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
export const isRoot = vm => {
  return vm.$root === vm;
};

/**
 * Get the first sibling of a Vue component filtered by a selector.
 * @param  {VueComponent} vm
 * @param  {string|VueComponent|VueQuery} selector
 * @param  {Boolean} ascending The order of the siblings
 * @return {?VueComponent}
 */
export const siblingsWithSort = (vm, selector, ascending) => {
  const siblings = rawSiblings(vm);
  if (!siblings.length) {
    return null;
  }
  const i = siblings.indexOf(vm);
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
export const siblingsAllWithSort = (vm, selector, ascending) => {
  const siblings = rawSiblings(vm, selector);
  if (!siblings.length) {
    return [];
  }

  const i = siblings.indexOf(vm);
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
export const siblingsUntilWithSort = (vm, until, filter, ascending) => {
  let siblings = rawSiblings(vm);
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

  const collected = [];
  for (let i = 0, j = siblings.length; i < j; ++i) {
    if (matches(siblings[i], until)) {
      break;
    }
    if (matches(siblings[i], filter)) {
      collected.push(siblings[i]);
    }
  }

  return collected;
};
