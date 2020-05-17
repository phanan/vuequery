import Vue from "vue";

export function isVueQuery(selector: Selector): selector is VueQuery {
  return (selector as VueQuery)._isVueQuery === true;
}

/**
 * Checks if a Vue component matches against a selector.
 * The selector can be either:
 * - a string (name of the component)
 * - a VueComponent object
 * - a VueQuery object
 */
export const matches = (vm: Vue, selector?: Selector | null): boolean => {
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
export const rawChildren = (vm: Vue, selector?: Selector | null): Vue[] => {
  const collected: Vue[] = [];

  vm.$children.forEach((child) => {
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
export const rawSiblings = (
  vm: Vue,
  selector?: Selector | null,
  withSelf = true
): Vue[] => {
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
 */
export const isRoot = (vm: Vue): boolean => {
  return vm.$root === vm;
};

/**
 * Get the first sibling of a Vue component filtered by a selector.
 */
export const siblingsWithSort = (
  vm: Vue,
  selector: Selector | null,
  direction: SortDirection
): Vue | null => {
  const siblings = rawSiblings(vm);

  if (!siblings.length) {
    return null;
  }

  const i = siblings.indexOf(vm);

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
export const siblingsAllWithSort = (
  vm: Vue,
  selector: Selector | null,
  direction: SortDirection
): Vue[] => {
  const siblings = rawSiblings(vm, selector);

  if (!siblings.length) {
    return [];
  }

  const i = siblings.indexOf(vm);

  return direction === "Ascending"
    ? siblings.slice(i + 1)
    : siblings.slice(0, i).reverse();
};

/**
 * Get all siblings of a Vue component filtered by a "filter" selector, and up to but
 * not including the "until" selector passed.
 */
export const siblingsUntilWithSort = (
  vm: Vue,
  until: Selector | undefined,
  filter: Selector | undefined,
  direction: SortDirection
): Vue[] => {
  let siblings = rawSiblings(vm);

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
