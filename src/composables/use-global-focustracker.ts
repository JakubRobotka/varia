import {
  ref,
  provide,
  inject,
  computed,
  Ref,
  InjectionKey,
  reactive,
} from '@vue/composition-api'
import { useEvent, useKeyIf } from './use-events'

export interface FocusTrackerState {
  prevEl: Readonly<Ref<HTMLElement | null>>
  activeEl: Readonly<Ref<HTMLElement | null>>
  currentEl: Readonly<Ref<HTMLElement | null>>
  tabDirection: Readonly<Ref<'backward' | 'forward' | null>>
}

export const key: InjectionKey<FocusTrackerState> = Symbol('globalFocusTracker')

export function provideGlobalFocusTracking(doProvide: boolean = true) {
  // all elements that are not claimed by an explicit FocusGroup
  // are part of the global FocusGroup

  const prevEl = ref<HTMLElement>(null)
  const activeEl = ref<HTMLElement>(document.activeElement)
  const docHasFocus = ref<boolean>(document.hasFocus())
  // when a FocusGroup takes aver focus management,
  // it notifies the tracker by calling this function

  useEvent(ref(document), 'focusin', e => {
    docHasFocus.value = true
    prevEl.value = activeEl.value
    activeEl.value = e.target as HTMLElement
  })

  useEvent(ref(document), 'focusout', () => {
    setTimeout(() => {
      docHasFocus.value = document.hasFocus()
    }, 0)
  })
  const state = {
    // State
    prevEl: computed(() => prevEl.value),
    activeEl: computed(() => activeEl.value),
    currentEl: computed(() => (docHasFocus.value ? activeEl.value : null)),
    tabDirection: useTabDirection(),
  }
  doProvide && provide(key, state)

  return state
}

export function useGlobalFocusTracker() {
  return inject(key) as FocusTrackerState
}

function useTabDirection() {
  const tabDirection = ref<'backward' | 'forward'>(null)
  useEvent(ref(document), 'keydown', ((event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      tabDirection.value = event.shiftKey ? 'backward' : 'forward'
    }
  }) as EventHandlerNonNull)

  return computed(() => tabDirection.value)
}
