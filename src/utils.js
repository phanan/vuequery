const warn = (msg, vm) => {
  if (process.env.NODE_ENV === "production" || typeof console === "undefined") {
    return;
  }

  if (vm.$options && vm.$options.__file) {
    msg += ` at ${vm.$options.__file}`;
  }
  console.warn(`[VueQuery] ${msg}`);
};

export default warn;
