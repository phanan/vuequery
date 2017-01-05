const warn = (msg, vm) => {
  if (process.env.NODE_ENV === 'production') {
    return
  }

  if (vm.$options && vm.$options.__file) {
    msg += ` at ${vm.$options.__file}`
  }
  console.error(`[VueQuery] ${msg}`)
}

export default warn
