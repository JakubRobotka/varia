import { computed, reactive, ref, Ref, toRaw, PropType, watchEffect } from 'vue'
import { useEvent } from 'vue-aria-composables'
import { isNativeTabbable } from '../utils/elements'
export interface TabbableOptions {
  disabled?: boolean | undefined
  focusable?: boolean | undefined
  onClick?: <T extends any>(e: T) => any
  onMouseDown?: <T extends any>(e: T) => any
  [key: string]: any
}

export const TabbableProps = {
  disabled: {
    type: Boolean as PropType<boolean>,
  },
  focusable: {
    type: Boolean as PropType<boolean>,
  },
}

const defaults = {
  disabled: false,
  focusable: undefined,
}

export function useTabbable(
  _options: Partial<TabbableOptions> = {},
  _el?: Ref<HTMLElement | undefined>
) {
  const options = reactive(Object.assign({}, defaults, _options))

  const el = _el || ref<HTMLElement>()

  const preventDefaults = (event: Event): true | undefined => {
    if (event.target !== toRaw(el.value)) return
    if (options.disabled) {
      event.stopImmediatePropagation()
      event.stopPropagation()
      event.preventDefault()
      return true
    }
    return undefined
  }
  const onClick = (event: Event) => {
    if (event.target !== toRaw(el.value)) return
    preventDefaults(event) || el.value?.focus()
  }
  useEvent(document, 'mouseDown', preventDefaults, { capture: true })
  useEvent(document, 'mouseOver', preventDefaults, { capture: true })
  useEvent(document, 'click', onClick, { capture: true })

  // I'd rather do this the "right" way: returning it as an attribute from this funcion
  // but it depends on wether the element's tagName which we only know after initial render,
  // when the `el` ref has been populated.
  // so we do it imperatively here:
  watchEffect(() => {
    const rawEl = el.value
    if (!rawEl) return
    if (!isNativeTabbable(rawEl)) {
      return
    }
    rawEl.disabled = options.disabled && !options.focusable
  })

  return computed(() => ({
    ref: el,
    tabindex: options.disabled && !options.focusable ? -1 : 0,
    'aria-disabled': options.disabled || undefined,
  }))
}
