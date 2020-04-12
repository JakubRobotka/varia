import { Ref, watch } from 'vue'
import { MaybeRef } from '../types'
import { wrap } from '../utils'

type ElementRefs = MaybeRef<HTMLElement> | MaybeRef<Window> | MaybeRef<Document>

// export function useEvent(
//   _el: MaybeRef<HTMLElement>,
//   name: string,
//   handler: (event: Event) => void,
//   opts?: boolean | AddEventListenerOptions
// ): () => void
// export function useEvent(
//   _el: MaybeRef<Window>,
//   name: string,
//   handler: (event: Event) => void,
//   opts?: boolean | AddEventListenerOptions
// ): () => void
// export function useEvent(
//   _el: MaybeRef<Document>,
//   name: string,
//   handler: (event: Event) => void,
//   opts?: boolean | AddEventListenerOptions
// ): () => void
export function useEvent(
  _el: ElementRefs,
  name: string,
  handler: (event: Event) => void,
  opts?: boolean | AddEventListenerOptions
) {
  const el = wrap((_el as unknown) as Element)
  const unwatch = watch(el, (el, _, onCleanup) => {
    el && el.addEventListener(name, handler, opts)
    onCleanup(() => {
      el && el.removeEventListener(name, handler, opts)
    })
  })

  return unwatch
}

// export function useEventIf<HTMLElement>(
//   condRef: Ref<boolean>,
//   elRef: MaybeRef<HTMLElement>,
//   name: string,
//   handler: EventListener,
//   opts?: boolean | AddEventListenerOptions
// ): () => void
// export function useEventIf(
//   condRef: Ref<boolean>,
//   elRef: MaybeRef<Document>,
//   name: string,
//   handler: EventListener,
//   opts?: boolean | AddEventListenerOptions
// ): () => void
// export function useEventIf(
//   condRef: Ref<boolean>,
//   elRef: MaybeRef<Window>,
//   name: string,
//   handler: EventListener,
//   opts?: boolean | AddEventListenerOptions
// ): () => void
export function useEventIf(
  condRef: Ref<boolean>,
  elRef: ElementRefs,
  name: string,
  handler: EventListener,
  opts?: boolean | AddEventListenerOptions
) {
  return useEvent(
    elRef,
    name,
    <T extends Event>(event: T) => condRef.value && handler(event),
    opts
  )
}

export function useKeyIf(
  condRef: Ref<boolean>,
  keys: string[],
  handler: EventListener,
  opts?: boolean | AddEventListenerOptions
) {
  return useEventIf(
    condRef,
    document,
    'keyup',
    ((e: KeyboardEvent) => {
      if (keys.indexOf((e as any).key) === -1) return
      handler(e)
    }) as EventListener,
    opts
  )
}
