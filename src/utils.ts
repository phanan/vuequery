const warn = (msg: string): void => {
  if (process.env.NODE_ENV === 'production' || typeof console === 'undefined') {
    return
  }

  console.warn(`[VueQuery] ${msg}`)
}

export default warn
