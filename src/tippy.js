import tippy from 'tippy.js'

const hasBindingChanged = (value, oldValue) => {
  return Object.keys(value).some(key => {
    return value[key] !== oldValue[key]
  })
}

export default (opts = {}) => {
  const init = (el, { value = {}, oldValue = {} }) => {
    if (!value) return
    if (el._tippy) {
      if (hasBindingChanged(value, oldValue)) {
        el._tippy.destroy()
        if (!value.disabled) tippy(el, Object.assign({}, opts, value, { performance: true }))
      }
    } else {
      if (!value.disabled) tippy(el, Object.assign({}, opts, value, { performance: true }))
    }
  }

  const unbind = el => {
    if (el._tippy) {
      el._tippy.destroy()
    }
  }

  return {
    inserted: init,
    componentUpdated: init,
    unbind,
  }
}
